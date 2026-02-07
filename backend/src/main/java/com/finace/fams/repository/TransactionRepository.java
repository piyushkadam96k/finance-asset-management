package com.finace.fams.repository;

import com.finace.fams.entity.Transaction;
import com.finace.fams.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromUserOrToUser(User fromUser, User toUser);
}
