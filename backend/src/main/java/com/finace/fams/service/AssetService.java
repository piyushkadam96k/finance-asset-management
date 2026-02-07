package com.finace.fams.service;

import com.finace.fams.dto.AssetRequest;
import com.finace.fams.entity.Asset;
import com.finace.fams.entity.AssetCategory;
import com.finace.fams.entity.AssetStatus;
import com.finace.fams.entity.User;
import com.finace.fams.exception.ResourceNotFoundException;
import com.finace.fams.repository.AssetCategoryRepository;
import com.finace.fams.repository.AssetRepository;
import com.finace.fams.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AssetService {
    private final AssetRepository assetRepository;
    private final AssetCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final MarketPriceService marketPriceService;

    public AssetService(AssetRepository assetRepository, AssetCategoryRepository categoryRepository,
                        UserRepository userRepository, MarketPriceService marketPriceService) {
        this.assetRepository = assetRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.marketPriceService = marketPriceService;
    }

    public Asset create(AssetRequest request) {
        AssetCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Asset asset = new Asset();
        asset.setAssetCode(request.getAssetCode());
        asset.setName(request.getName());
        asset.setCategory(category);
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setPurchaseValue(request.getPurchaseValue());
        asset.setCurrentValue(request.getCurrentValue());
        asset.setOwner(owner);
        asset.setStatus(request.getStatus());
        return assetRepository.save(asset);
    }

    public Asset update(Long id, AssetRequest request) {
        Asset asset = getById(id);
        AssetCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        asset.setAssetCode(request.getAssetCode());
        asset.setName(request.getName());
        asset.setCategory(category);
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setPurchaseValue(request.getPurchaseValue());
        asset.setCurrentValue(request.getCurrentValue());
        asset.setOwner(owner);
        asset.setStatus(request.getStatus());
        return assetRepository.save(asset);
    }

    public void delete(Long id) {
        assetRepository.deleteById(id);
    }

    public Asset getById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));
    }

    public List<Asset> getAll() {
        return assetRepository.findAll();
    }

    public List<Asset> getByOwner(User user) {
        return assetRepository.findByOwner(user);
    }

    public Asset updateValuation(Long id) {
        Asset asset = getById(id);
        String categoryName = asset.getCategory() != null ? asset.getCategory().getName() : "";

        if ("Fixed Assets".equalsIgnoreCase(categoryName)) {
            asset.setCurrentValue(calculateStraightLineDepreciation(asset));
        } else {
            asset.setCurrentValue(marketPriceService.getMockPrice(asset.getCurrentValue()));
        }
        return assetRepository.save(asset);
    }

    private BigDecimal calculateStraightLineDepreciation(Asset asset) {
        // Simple academic formula: assume 5-year life, 10% salvage value
        BigDecimal cost = asset.getPurchaseValue();
        BigDecimal salvage = cost.multiply(BigDecimal.valueOf(0.10));
        long yearsUsed = ChronoUnit.YEARS.between(asset.getPurchaseDate(), LocalDate.now());
        if (yearsUsed < 0) { yearsUsed = 0; }
        BigDecimal annualDep = cost.subtract(salvage).divide(BigDecimal.valueOf(5), java.math.RoundingMode.HALF_UP);
        BigDecimal depAmount = annualDep.multiply(BigDecimal.valueOf(yearsUsed));
        BigDecimal current = cost.subtract(depAmount);
        return current.compareTo(salvage) < 0 ? salvage : current;
    }
}
