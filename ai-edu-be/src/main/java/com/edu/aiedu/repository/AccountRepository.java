package com.edu.aiedu.repository;

import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import io.micrometer.common.lang.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String>, PagingAndSortingRepository<Account, String> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<Account> findByUsername(String username);
    @NonNull Optional<Account> findById(@NonNull String id);
    Optional<Account> findByEmail(String email);
    void deleteById(@NonNull String id);
}
