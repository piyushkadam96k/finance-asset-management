package com.finace.fams.service;

import com.finace.fams.dto.AuthResponse;
import com.finace.fams.dto.LoginRequest;
import com.finace.fams.dto.RegisterRequest;
import com.finace.fams.entity.Portfolio;
import com.finace.fams.entity.Role;
import com.finace.fams.entity.User;
import com.finace.fams.exception.BadRequestException;
import com.finace.fams.repository.PortfolioRepository;
import com.finace.fams.repository.RoleRepository;
import com.finace.fams.repository.UserRepository;
import com.finace.fams.security.JwtUtil;
import java.time.LocalDateTime;
import java.util.Collections;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PortfolioRepository portfolioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PortfolioRepository portfolioRepository,
                       PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.portfolioRepository = portfolioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        Role role = roleRepository.findByName(request.getRole().toUpperCase())
                .orElseThrow(() -> new BadRequestException("Invalid role"));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(role));
        User saved = userRepository.save(user);
        ensurePortfolio(saved);
        return saved;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtUtil.generateToken(request.getEmail());
        String role = auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .filter(a -> a.startsWith("ROLE_"))
                .findFirst()
                .orElse("ROLE_EMPLOYEE");
        return new AuthResponse(token, role);
    }

    private void ensurePortfolio(User user) {
        portfolioRepository.findByUser(user).orElseGet(() -> {
            Portfolio p = new Portfolio();
            p.setUser(user);
            p.setCreatedAt(LocalDateTime.now());
            return portfolioRepository.save(p);
        });
    }
}
