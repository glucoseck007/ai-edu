package com.edu.aiedu.configuration;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import java.io.IOException;

@Slf4j
public class HeaderValidationFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String gatewayHeader = request.getHeader("X-From-Gateway");

        if (gatewayHeader == null || gatewayHeader.isEmpty()) {
            log.info("X-From-Gateway header is missing, but proceeding with the request");
        } else if ("valid".equals(gatewayHeader)) {
            log.info("Header validated successfully");
        } else {
            log.warn("Invalid X-From-Gateway header value: {}", gatewayHeader);
        }

        filterChain.doFilter(servletRequest, servletResponse);  // Always continue processing the request
    }
}

//@Slf4j
//public class HeaderValidationFilter implements Filter {
//
//    @Override
//    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
//        HttpServletRequest request = (HttpServletRequest) servletRequest;
//        HttpServletResponse response = (HttpServletResponse) servletResponse;
//
//        String gatewayHeader = request.getHeader("X-From-Gateway");
//
//        if ("valid".equals(gatewayHeader)) {
//            log.info("Header validated successfully");  // Add a log for debugging
//            filterChain.doFilter(servletRequest, servletResponse);  // Continue processing the request
//        } else {
//            log.warn("Forbidden request: Missing or invalid X-From-Gateway header");  // Log the rejection
//            response.setStatus(HttpStatus.FORBIDDEN.value());  // Reject the request with 403 Forbidden status
//        }
//    }
//}
