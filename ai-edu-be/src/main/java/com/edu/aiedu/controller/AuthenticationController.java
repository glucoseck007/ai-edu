package com.edu.aiedu.controller;

import com.edu.aiedu.dto.request.auth.AuthenticationRequest;
import com.edu.aiedu.dto.request.auth.IntrospectRequest;
import com.edu.aiedu.dto.request.auth.LogoutRequest;
import com.edu.aiedu.dto.response.ApiResponse;
import com.edu.aiedu.dto.response.AuthenticationResponse;
import com.edu.aiedu.dto.response.IntrospectResponse;
import com.edu.aiedu.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/outbound/authentication")
    ApiResponse<AuthenticationResponse> outboundAuthentication(
            @RequestParam("code") String code) {
        var result = authenticationService.outboundAuthenticate(code);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {

        var result = authenticationService.authenticate(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {

        var result = authenticationService.introspect(request);

        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {

        authenticationService.logout(request);

        return ApiResponse.<Void>builder()
                .build();
    }

}
