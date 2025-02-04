package com.edu.aiedu.mapper;

import com.edu.aiedu.dto.request.account.AccountCreationRequest;
import com.edu.aiedu.dto.request.account.AccountUpdateRequest;
import com.edu.aiedu.dto.response.AccountResponse;
import com.edu.aiedu.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    Account toUser(AccountCreationRequest request);
    AccountResponse toUserResponse(Account account);
    void updateUser(@MappingTarget Account account, AccountUpdateRequest request);

}
