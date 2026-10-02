package com.prangyajeet.labtrack.dailyconsumable.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DailyConsumableSummaryDTO {

    private Integer totalTransactions;

    private Integer totalQuantityUsed;

    private BigDecimal totalUsageValue;

    private List<DepartmentUsageSummaryDTO> departmentSummaries =
            new ArrayList<>();

    public DailyConsumableSummaryDTO() {
    }

    public Integer getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Integer totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public Integer getTotalQuantityUsed() {
        return totalQuantityUsed;
    }

    public void setTotalQuantityUsed(Integer totalQuantityUsed) {
        this.totalQuantityUsed = totalQuantityUsed;
    }

    public BigDecimal getTotalUsageValue() {
        return totalUsageValue;
    }

    public void setTotalUsageValue(BigDecimal totalUsageValue) {
        this.totalUsageValue = totalUsageValue;
    }

    public List<DepartmentUsageSummaryDTO> getDepartmentSummaries() {
        return departmentSummaries;
    }

    public void setDepartmentSummaries(
            List<DepartmentUsageSummaryDTO> departmentSummaries) {

        this.departmentSummaries = departmentSummaries;
    }

    public static class DepartmentUsageSummaryDTO {

        private Long departmentId;

        private String departmentName;

        private Integer totalQuantityUsed;

        private Integer transactionCount;

        public DepartmentUsageSummaryDTO() {
        }

        public DepartmentUsageSummaryDTO(
                Long departmentId,
                String departmentName,
                Integer totalQuantityUsed,
                Integer transactionCount) {

            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.totalQuantityUsed = totalQuantityUsed;
            this.transactionCount = transactionCount;
        }

        public Long getDepartmentId() {
            return departmentId;
        }

        public void setDepartmentId(Long departmentId) {
            this.departmentId = departmentId;
        }

        public String getDepartmentName() {
            return departmentName;
        }

        public void setDepartmentName(String departmentName) {
            this.departmentName = departmentName;
        }

        public Integer getTotalQuantityUsed() {
            return totalQuantityUsed;
        }

        public void setTotalQuantityUsed(Integer totalQuantityUsed) {
            this.totalQuantityUsed = totalQuantityUsed;
        }

        public Integer getTransactionCount() {
            return transactionCount;
        }

        public void setTransactionCount(Integer transactionCount) {
            this.transactionCount = transactionCount;
        }
    }
}