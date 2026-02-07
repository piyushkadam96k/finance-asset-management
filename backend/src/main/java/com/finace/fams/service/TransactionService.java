package com.finace.fams.service;

import com.finace.fams.dto.TransactionRequest;
import com.finace.fams.entity.Asset;
import com.finace.fams.entity.Transaction;
import com.finace.fams.entity.TransactionType;
import com.finace.fams.entity.User;
import com.finace.fams.exception.BadRequestException;
import com.finace.fams.exception.ResourceNotFoundException;
import com.finace.fams.repository.AssetRepository;
import com.finace.fams.repository.TransactionRepository;
import com.finace.fams.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, AssetRepository assetRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
    }

    public Transaction create(TransactionRequest request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        User fromUser = null;
        User toUser = null;
        if (request.getFromUserId() != null) {
            fromUser = userRepository.findById(request.getFromUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("From user not found"));
        }
        if (request.getToUserId() != null) {
            toUser = userRepository.findById(request.getToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("To user not found"));
        }

        validateRequest(request.getType(), fromUser, toUser);

        Transaction tx = new Transaction();
        tx.setReferenceNo(generateReference());
        tx.setAsset(asset);
        tx.setType(request.getType());
        tx.setTransactionDate(LocalDateTime.now());
        tx.setQuantity(request.getQuantity());
        tx.setPrice(request.getPrice() != null ? request.getPrice() : asset.getCurrentValue());
        BigDecimal amount = tx.getPrice().multiply(BigDecimal.valueOf(tx.getQuantity() > 0 ? tx.getQuantity() : 1));
        tx.setAmount(amount);
        tx.setFromUser(fromUser);
        tx.setToUser(toUser);
        tx.setNotes(request.getNotes());

        if (toUser != null && (request.getType() == TransactionType.BUY
                || request.getType() == TransactionType.SELL
                || request.getType() == TransactionType.TRANSFER)) {
            asset.setOwner(toUser);
            assetRepository.save(asset);
        }
        return transactionRepository.save(tx);
    }

    public List<Transaction> getAll() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getByUser(User user) {
        return transactionRepository.findByFromUserOrToUser(user, user);
    }

    private String generateReference() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void validateRequest(TransactionType type, User fromUser, User toUser) {
        if (type == null) {
            throw new BadRequestException("Transaction type is required");
        }
        if ((type == TransactionType.BUY || type == TransactionType.SELL || type == TransactionType.TRANSFER)
                && toUser == null) {
            throw new BadRequestException("toUserId is required for " + type);
        }
        if ((type == TransactionType.TRANSFER || type == TransactionType.WITHDRAWAL) && fromUser == null) {
            throw new BadRequestException("fromUserId is required for " + type);
        }
    }
}
