package com.finace.fams.service;

import com.finace.fams.entity.Asset;
import com.finace.fams.entity.Transaction;
import com.finace.fams.entity.TransactionType;
import com.finace.fams.repository.AssetRepository;
import com.finace.fams.repository.TransactionRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
    private final AssetRepository assetRepository;
    private final TransactionRepository transactionRepository;

    public ReportService(AssetRepository assetRepository, TransactionRepository transactionRepository) {
        this.assetRepository = assetRepository;
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> assetUtilizationReport() {
        List<Asset> assets = assetRepository.findAll();
        Map<String, Long> byStatus = new HashMap<>();
        assets.forEach(a -> byStatus.put(a.getStatus().name(), byStatus.getOrDefault(a.getStatus().name(), 0L) + 1));

        Map<String, Object> report = new HashMap<>();
        report.put("totalAssets", assets.size());
        report.put("byStatus", byStatus);
        return report;
    }

    public Map<String, Object> profitLossReport() {
        List<Transaction> txs = transactionRepository.findAll();
        BigDecimal buy = BigDecimal.ZERO;
        BigDecimal sell = BigDecimal.ZERO;

        for (Transaction tx : txs) {
            if (tx.getType() == TransactionType.BUY) {
                buy = buy.add(tx.getAmount());
            }
            if (tx.getType() == TransactionType.SELL) {
                sell = sell.add(tx.getAmount());
            }
        }
        Map<String, Object> report = new HashMap<>();
        report.put("totalBuy", buy);
        report.put("totalSell", sell);
        report.put("profitOrLoss", sell.subtract(buy));
        return report;
    }

    public Map<String, Object> balanceSheetReport() {
        List<Asset> assets = assetRepository.findAll();
        BigDecimal totalAssets = assets.stream()
                .map(Asset::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> report = new HashMap<>();
        report.put("assets", totalAssets);
        report.put("liabilities", BigDecimal.ZERO);
        report.put("equity", totalAssets);
        return report;
    }

    public byte[] generatePdf(String title, Map<String, Object> data) {
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph(title));
            document.add(new Paragraph("------------------------------------"));
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                document.add(new Paragraph(entry.getKey() + ": " + entry.getValue()));
            }
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            return new byte[0];
        }
    }
}
