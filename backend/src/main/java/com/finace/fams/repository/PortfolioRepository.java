package com.finace.fams.repository;

import com.finace.fams.entity.Portfolio;
import com.finace.fams.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Optional<Portfolio> findByUser(User user);
}
