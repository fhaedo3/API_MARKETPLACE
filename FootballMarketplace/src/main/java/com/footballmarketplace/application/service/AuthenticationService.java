package com.footballmarketplace.application.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.footballmarketplace.api.controller.auth.AuthenticationRequest;
import com.footballmarketplace.api.controller.auth.AuthenticationResponse;
import com.footballmarketplace.api.controller.auth.RegisterRequest;
import com.footballmarketplace.api.controller.config.JwtService;
import com.footballmarketplace.domain.model.User;
import com.footballmarketplace.domain.interfaces.IUserRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final IUserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {
                var user = User.builder()
                                                .username(request.getUsername())
                                                .email(request.getEmail())
                                                .password(passwordEncoder.encode(request.getPassword()))
                                                .role(request.getRole())
                                                .build();

                repository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .build();
        }
}
