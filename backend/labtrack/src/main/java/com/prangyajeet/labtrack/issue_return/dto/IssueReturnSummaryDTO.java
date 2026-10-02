package com.prangyajeet.labtrack.issue_return.dto;

public class IssueReturnSummaryDTO {

    private long totalIssued;

    private long returned;

    private long overdue;


    public IssueReturnSummaryDTO() {
    }


    public IssueReturnSummaryDTO(
            long totalIssued,
            long returned,
            long overdue) {

        this.totalIssued =
                totalIssued;

        this.returned =
                returned;

        this.overdue =
                overdue;
    }


    public long getTotalIssued() {
        return totalIssued;
    }

    public void setTotalIssued(
            long totalIssued) {

        this.totalIssued =
                totalIssued;
    }


    public long getReturned() {
        return returned;
    }

    public void setReturned(
            long returned) {

        this.returned =
                returned;
    }


    public long getOverdue() {
        return overdue;
    }

    public void setOverdue(
            long overdue) {

        this.overdue =
                overdue;
    }
}