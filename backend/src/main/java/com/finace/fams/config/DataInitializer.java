package com.finace.fams.config;

import com.finace.fams.entity.AssetCategory;
import com.finace.fams.entity.Permission;
import com.finace.fams.entity.Portfolio;
import com.finace.fams.entity.Role;
import com.finace.fams.entity.User;
import com.finace.fams.repository.AssetCategoryRepository;
import com.finace.fams.repository.PermissionRepository;
import com.finace.fams.repository.PortfolioRepository;
import com.finace.fams.repository.RoleRepository;
import com.finace.fams.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(RoleRepository roleRepo, PermissionRepository permRepo,
                               UserRepository userRepo, PortfolioRepository portfolioRepo,
                               AssetCategoryRepository catRepo,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            // Permissions
            Permission view = permRepo.findByName("VIEW").orElseGet(() -> permRepo.save(new Permission("VIEW")));
            Permission add = permRepo.findByName("ADD").orElseGet(() -> permRepo.save(new Permission("ADD")));
            Permission edit = permRepo.findByName("EDIT").orElseGet(() -> permRepo.save(new Permission("EDIT")));
            Permission delete = permRepo.findByName("DELETE").orElseGet(() -> permRepo.save(new Permission("DELETE")));
            Permission report = permRepo.findByName("REPORT").orElseGet(() -> permRepo.save(new Permission("REPORT")));

            // Role-based access: each role has different permissions.
            Map<String, Set<Permission>> rolePermissions = Map.of(
                    "ADMIN", Set.of(view, add, edit, delete, report),
                    "MANAGER", Set.of(view, add, edit, report),
                    "EMPLOYEE", Set.of(view, add, edit),
                    "INVESTOR", Set.of(view, report)
            );

            for (String roleName : rolePermissions.keySet()) {
                Role role = roleRepo.findByName(roleName).orElseGet(() -> roleRepo.save(new Role(roleName)));
                role.setPermissions(new HashSet<>(rolePermissions.get(roleName)));
                roleRepo.save(role);
            }

            // Demo users (for testing in college project)
            seedUserIfMissing("admin@fams.com", "System Admin", "admin123", "ADMIN",
                    roleRepo, userRepo, portfolioRepo, passwordEncoder);
            seedUserIfMissing("manager@fams.com", "Demo Manager", "manager123", "MANAGER",
                    roleRepo, userRepo, portfolioRepo, passwordEncoder);
            seedUserIfMissing("employee@fams.com", "Demo Employee", "employee123", "EMPLOYEE",
                    roleRepo, userRepo, portfolioRepo, passwordEncoder);
            seedUserIfMissing("investor@fams.com", "Demo Investor", "investor123", "INVESTOR",
                    roleRepo, userRepo, portfolioRepo, passwordEncoder);

            // Asset categories
            List<String> categories = Arrays.asList("Stocks", "Bonds", "Mutual Funds", "Real Estate", "Fixed Assets");
            for (String c : categories) {
                catRepo.findByName(c).orElseGet(() -> catRepo.save(new AssetCategory(c)));
            }
        };
    }

    private void seedUserIfMissing(String email, String fullName, String rawPassword, String roleName,
                                   RoleRepository roleRepo, UserRepository userRepo,
                                   PortfolioRepository portfolioRepo, PasswordEncoder passwordEncoder) {
        if (userRepo.existsByEmail(email)) {
            userRepo.findByEmail(email).ifPresent(u -> ensurePortfolio(u, portfolioRepo));
            return;
        }

        Role role = roleRepo.findByName(roleName).orElseThrow();
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRoles(new HashSet<>(List.of(role)));
        User saved = userRepo.save(user);
        ensurePortfolio(saved, portfolioRepo);
    }

    private void ensurePortfolio(User user, PortfolioRepository portfolioRepo) {
        portfolioRepo.findByUser(user).orElseGet(() -> {
            Portfolio p = new Portfolio();
            p.setUser(user);
            p.setCreatedAt(LocalDateTime.now());
            return portfolioRepo.save(p);
        });
    }
}
