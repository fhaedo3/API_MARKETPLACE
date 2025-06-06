package com.footballmarketplace.application.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.footballmarketplace.api.controller.auth.AuthenticationRequest;
import com.footballmarketplace.api.controller.config.JwtService;
import com.footballmarketplace.application.dto.request.UserRequest;
import com.footballmarketplace.application.dto.response.AuthenticationResponse;
import com.footballmarketplace.domain.enums.Role;
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

   public AuthenticationResponse register(UserRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .teamName(request.getTeamName())
                .yearFounded(request.getYearFounded())
                .stadium(request.getStadium())
                .city(request.getCity())
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .build();

        repository.save(user);
        var jwtToken = jwtService.generateToken(user); // Usa el método que acepta User
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
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        var jwtToken = jwtService.generateToken(user); // Usa el método que acepta User
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }
}