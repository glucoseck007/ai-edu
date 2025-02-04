package com.edu.aiedu.service;

import com.edu.aiedu.dto.request.account.UserInfoDTO;
import com.edu.aiedu.dto.request.auth.AuthenticationRequest;
import com.edu.aiedu.dto.request.auth.ExchangeTokenRequest;
import com.edu.aiedu.dto.request.auth.IntrospectRequest;
import com.edu.aiedu.dto.request.auth.LogoutRequest;
import com.edu.aiedu.dto.response.AuthenticationResponse;
import com.edu.aiedu.dto.response.IntrospectResponse;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.InvalidatedToken;
import com.edu.aiedu.enums.Role;
import com.edu.aiedu.exception.AppException;
import com.edu.aiedu.exception.ErrorCode;
import com.edu.aiedu.repository.AccountRepository;
import com.edu.aiedu.repository.InvalidatedTokenRepository;
import com.edu.aiedu.repository.OutboundIdentityClient;
import com.edu.aiedu.repository.OutboundUserClient;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Set;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AuthenticationService {

    AccountRepository accountRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    OutboundIdentityClient outboundIdentityClient;
    OutboundUserClient outboundUserClient;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${spring.outbound.identity.google.client-id}")
    protected String CLIENT_ID;

    @NonFinal
    @Value("${spring.outbound.identity.google.client-secret}")
    protected String CLIENT_SECRET;

    @NonFinal
    @Value("${spring.outbound.identity.google.redirect-uri}")
    protected String REDIRECT_URI;

    @NonFinal
    protected String GRANT_TYPE = "authorization_code";


    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    public AuthenticationResponse outboundAuthenticate(String code) {

        var response = outboundIdentityClient.exchangeToken(ExchangeTokenRequest.builder()
                        .code(code)
                        .clientId(CLIENT_ID)
                        .clientSecret(CLIENT_SECRET)
                        .redirectUri(REDIRECT_URI)
                        .grantType(GRANT_TYPE)
                .build());

        log.info("TOKEN RESPONSE {}", response);

        var accountInfo = outboundUserClient.getUserInfo("json", response.getAccessToken());

        log.info("USER INFO {}", accountInfo);

        var account = accountRepository.findByUsername(accountInfo.getEmail()).orElseGet(() ->
                accountRepository.save(Account.builder()
                                .username(accountInfo.getEmail())
                                .firstName(accountInfo.getGivenName())
                                .lastName(accountInfo.getFamilyName())
                                .email(accountInfo.getEmail())
                                .roles(Set.of(Role.STUDENT.name()))
                        .build())
                );

        var token = generateToken(account);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        var userInfo = UserInfoDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .roles(user.getRoles())
                .build();

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .user(userInfo)
                .token(token)
                .authenticated(true)
                .build();

    }


    private String generateToken(Account account) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("future-me.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(account))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        var signJWT = verifyToken(request.getToken());

        String jit = signJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException{

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expirationTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    private String buildScope(Account account) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(account.getRoles())) {
            account.getRoles().forEach(stringJoiner::add);
        }
        return stringJoiner.toString();
    }

}
