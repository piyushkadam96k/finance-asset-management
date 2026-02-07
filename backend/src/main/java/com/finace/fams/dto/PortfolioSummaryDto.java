package com.finace.fams.dto;

import java.math.BigDecimal;
import java.util.Map;

public class PortfolioSummaryDto {
    private int totalAssets;
    private BigDecimal totalValue;
    private BigDecimal roiPercentage;
    private String riskLevel;
    private Map<String, Double> diversification;

    public int getTotalAssets() { return totalAssets; }
    public void setTotalAssets(int totalAssets) { this.totalAssets = totalAssets; }
    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
    public BigDecimal getRoiPercentage() { return roiPercentage; }
    public void setRoiPercentage(BigDecimal roiPercentage) { this.roiPercentage = roiPercentage; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public Map<String, Double> getDiversification() { return diversification; }
    public void setDiversification(Map<String, Double> diversification) { this.diversification = diversification; }
}
