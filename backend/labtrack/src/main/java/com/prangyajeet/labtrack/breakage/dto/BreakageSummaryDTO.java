package com.prangyajeet.labtrack.breakage.dto;

import java.math.BigDecimal;

public class BreakageSummaryDTO {

    private long totalBreakages;

    private BigDecimal totalCost;

    private long pendingRecovery;

    private long paidRecovery;

    private long waivedRecovery;

    public long getTotalBreakages() {
        return totalBreakages;
    }

    public void setTotalBreakages(long totalBreakages) {
        this.totalBreakages = totalBreakages;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public long getPendingRecovery() {
        return pendingRecovery;
    }

    public void setPendingRecovery(long pendingRecovery) {
        this.pendingRecovery = pendingRecovery;
    }

    public long getPaidRecovery() {
        return paidRecovery;
    }

    public void setPaidRecovery(long paidRecovery) {
        this.paidRecovery = paidRecovery;
    }

    public long getWaivedRecovery() {
        return waivedRecovery;
    }

    public void setWaivedRecovery(long waivedRecovery) {
        this.waivedRecovery = waivedRecovery;
    }
}