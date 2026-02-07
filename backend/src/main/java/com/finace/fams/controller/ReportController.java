package com.finace.fams.controller;

import com.finace.fams.service.ReportService;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/asset-utilization")
    @PreAuthorize("hasAuthority('REPORT')")
    public Map<String, Object> assetUtilization() {
        return reportService.assetUtilizationReport();
    }

    @GetMapping("/profit-loss")
    @PreAuthorize("hasAuthority('REPORT')")
    public Map<String, Object> profitLoss() {
        return reportService.profitLossReport();
    }

    @GetMapping("/balance-sheet")
    @PreAuthorize("hasAuthority('REPORT')")
    public Map<String, Object> balanceSheet() {
        return reportService.balanceSheetReport();
    }

    @GetMapping("/asset-utilization/pdf")
    @PreAuthorize("hasAuthority('REPORT')")
    public ResponseEntity<byte[]> assetUtilizationPdf() {
        Map<String, Object> data = reportService.assetUtilizationReport();
        byte[] pdf = reportService.generatePdf("Asset Utilization Report", data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=asset-utilization.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/profit-loss/pdf")
    @PreAuthorize("hasAuthority('REPORT')")
    public ResponseEntity<byte[]> profitLossPdf() {
        Map<String, Object> data = reportService.profitLossReport();
        byte[] pdf = reportService.generatePdf("Profit & Loss Statement", data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=profit-loss.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/balance-sheet/pdf")
    @PreAuthorize("hasAuthority('REPORT')")
    public ResponseEntity<byte[]> balanceSheetPdf() {
        Map<String, Object> data = reportService.balanceSheetReport();
        byte[] pdf = reportService.generatePdf("Balance Sheet", data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=balance-sheet.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
