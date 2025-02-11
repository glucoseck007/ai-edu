package com.edu.aiedu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
	
@SpringBootApplication
@EnableFeignClients(basePackages = "com.edu.aiedu.repository")
public class AiEduBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiEduBeApplication.class, args);
	}

}
