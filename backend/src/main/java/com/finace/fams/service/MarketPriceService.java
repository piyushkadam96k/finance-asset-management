package com.finace.fams.service;

import java.math.BigDecimal;
import java.util.Random;
import org.springframework.stereotype.Service;

@Service
public class MarketPriceService {
    private final Random random = new Random();

    public BigDecimal getMockPrice(BigDecimal currentValue) {
        // Mock price fluctuation between -5% and +5%
        double factor = 0.95 + (0.10 * random.nextDouble());
        return currentValue.multiply(BigDecimal.valueOf(factor));
    }
}
