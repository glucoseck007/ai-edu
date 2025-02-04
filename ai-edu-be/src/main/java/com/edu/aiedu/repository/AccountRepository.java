package com.edu.aiedu.repository;

import com.edu.aiedu.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String>, PagingAndSortingRepository<Account, String> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<Account> findByUsername(String username);
}
