package com.finace.fams.controller;

import com.finace.fams.dto.PortfolioSummaryDto;
import com.finace.fams.entity.User;
import com.finace.fams.exception.ResourceNotFoundException;
import com.finace.fams.repository.UserRepository;
import com.finace.fams.service.PortfolioService;
import java.security.Principal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {
    private final PortfolioService portfolioService;
    private final UserRepository userRepository;

    public PortfolioController(PortfolioService portfolioService, UserRepository userRepository) {
        this.portfolioService = portfolioService;
        this.userRepository = userRepository;
    }

    @GetMapping("/summary/me")
    @PreAuthorize("hasAuthority('VIEW')")
    public PortfolioSummaryDto mySummary(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return portfolioService.getSummary(user.getId());
    }

    @GetMapping("/summary/{userId}")
    @PreAuthorize("hasAuthority('VIEW') and (hasRole('ADMIN') or hasRole('MANAGER'))")
    public PortfolioSummaryDto summary(@PathVariable Long userId) {
        return portfolioService.getSummary(userId);
    }
}
