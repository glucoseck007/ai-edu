package com.edu.aiedu.repository;

import com.edu.aiedu.dto.response.OutboundAccountResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "outbound-user-client",url = "https://www.googleapis.com")
public interface OutboundUserClient {
    @GetMapping("/oauth2/v1/userinfo")
    OutboundAccountResponse getUserInfo(@RequestParam("alt") String alt,
                                        @RequestParam("access_token") String accessToken);

}
