package com.edu.aiedu.configuration;

import com.edu.aiedu.entity.Account;
import com.edu.aiedu.enums.Role;
import com.edu.aiedu.repository.AccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AppInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(AccountRepository accountRepository) {
        return args -> {
           if (accountRepository.findByUsername("admin").isEmpty()) {
               var roles = new HashSet<String>();
               roles.add(Role.ADMIN.name());
                Account account = Account.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .roles(roles)
                        .build();
                accountRepository.save(account);
                log.warn("admin user has been created with default password: admin, please change it.");
            }
        };
    }
}
