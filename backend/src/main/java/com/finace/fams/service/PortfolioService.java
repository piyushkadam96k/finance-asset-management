package com.finace.fams.service;

import com.finace.fams.dto.PortfolioSummaryDto;
import com.finace.fams.entity.Asset;
import com.finace.fams.entity.User;
import com.finace.fams.exception.ResourceNotFoundException;
import com.finace.fams.repository.AssetRepository;
import com.finace.fams.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class PortfolioService {
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    public PortfolioService(AssetRepository assetRepository, UserRepository userRepository) {
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
    }

    public PortfolioSummaryDto getSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Asset> assets = assetRepository.findByOwner(user);

        BigDecimal totalValue = assets.stream()
                .map(Asset::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPurchase = assets.stream()
                .map(Asset::getPurchaseValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal roi = BigDecimal.ZERO;
        if (totalPurchase.compareTo(BigDecimal.ZERO) > 0) {
            roi = totalValue.subtract(totalPurchase)
                    .divide(totalPurchase, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        String risk = assets.size() > 5 ? "Medium" : "High";
        Map<String, Double> diversification = new HashMap<>();
        int totalAssets = assets.size();
        assets.forEach(a -> {
            String key = a.getCategory() != null ? a.getCategory().getName() : "Other";
            diversification.put(key, diversification.getOrDefault(key, 0.0) + 1.0);
        });
        if (totalAssets > 0) {
            for (String key : diversification.keySet()) {
                diversification.put(key, (diversification.get(key) / totalAssets) * 100);
            }
        }

        PortfolioSummaryDto dto = new PortfolioSummaryDto();
        dto.setTotalAssets(totalAssets);
        dto.setTotalValue(totalValue);
        dto.setRoiPercentage(roi);
        dto.setRiskLevel(risk);
        dto.setDiversification(diversification);
        return dto;
    }
}
