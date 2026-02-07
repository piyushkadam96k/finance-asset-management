package com.finace.fams.controller;

import com.finace.fams.dto.TransactionRequest;
import com.finace.fams.entity.Transaction;
import com.finace.fams.entity.User;
import com.finace.fams.exception.ResourceNotFoundException;
import com.finace.fams.repository.UserRepository;
import com.finace.fams.service.TransactionService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public TransactionController(TransactionService transactionService, UserRepository userRepository) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADD')")
    public Transaction create(@Valid @RequestBody TransactionRequest request) {
        return transactionService.create(request);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW') and (hasRole('ADMIN') or hasRole('MANAGER') or hasRole('EMPLOYEE'))")
    public List<Transaction> all() {
        return transactionService.getAll();
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('VIEW')")
    public List<Transaction> myTransactions(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return transactionService.getByUser(user);
    }
}
