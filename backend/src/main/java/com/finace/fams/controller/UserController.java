package com.finace.fams.controller;

import com.finace.fams.dto.UpdateProfileRequest;
import com.finace.fams.dto.UserProfileDto;
import com.finace.fams.entity.User;
import com.finace.fams.service.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<User> allUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public UserProfileDto me(Principal principal) {
        return userService.getProfile(principal.getName());
    }

    @PutMapping("/me")
    public UserProfileDto updateMe(Principal principal, @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateFullName(principal.getName(), request.getFullName());
    }
}
