package com.prangyajeet.labtrack.report.export;

import com.prangyajeet.labtrack.report.dto.ReportResponseDTO;
import com.prangyajeet.labtrack.report.dto.ReportRowDTO;
import com.prangyajeet.labtrack.report.entity.ReportType;
import com.prangyajeet.labtrack.report.service.ReportExportService;
import com.prangyajeet.labtrack.report.service.ReportService;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportExportServiceImpl implements ReportExportService {

    private final ReportService reportService;

    public ReportExportServiceImpl(
            ReportService reportService
    ) {
        this.reportService = reportService;
    }

    // ============================================================
    // PDF EXPORT
    // ============================================================

    @Override
    public byte[] exportPdf(
            LocalDate fromDate,
            LocalDate toDate,
            Long departmentId,
            ReportType reportType
    ) {

        ReportResponseDTO report =
                reportService.generateReport(
                        fromDate,
                        toDate,
                        departmentId,
                        reportType
                );

        try {
            return generatePdf(
                    report,
                    fromDate,
                    toDate,
                    departmentId,
                    reportType
            );

        } catch (Exception exception) {

            exception.printStackTrace();

            throw new IllegalStateException(
                    "Failed to generate PDF report.",
                    exception
            );
        }
    }

    // ============================================================
    // EXCEL EXPORT
    // ============================================================

    @Override
    public byte[] exportExcel(
            LocalDate fromDate,
            LocalDate toDate,
            Long departmentId,
            ReportType reportType
    ) {

        ReportResponseDTO report =
                reportService.generateReport(
                        fromDate,
                        toDate,
                        departmentId,
                        reportType
                );

        try {
            return generateExcel(report);

        } catch (Exception exception) {

            exception.printStackTrace();

            throw new IllegalStateException(
                    "Failed to generate Excel report.",
                    exception
            );
        }
    }

    // ============================================================
    // PDF GENERATION
    // ============================================================

    private byte[] generatePdf(
            ReportResponseDTO report,
            LocalDate fromDate,
            LocalDate toDate,
            Long departmentId,
            ReportType reportType
    ) throws Exception {

        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        Document document =
                new Document(
                        PageSize.A4.rotate(),
                        18,
                        18,
                        22,
                        22
                );

        PdfWriter.getInstance(
                document,
                outputStream
        );

        document.open();

        Font titleFont =
                new Font(
                        Font.HELVETICA,
                        18,
                        Font.BOLD
                );

        Font sectionFont =
                new Font(
                        Font.HELVETICA,
                        11,
                        Font.BOLD
                );

        Font normalFont =
                new Font(
                        Font.HELVETICA,
                        6.5F,
                        Font.NORMAL
                );

        Font headerFont =
                new Font(
                        Font.HELVETICA,
                        6.5F,
                        Font.BOLD
                );

        // --------------------------------------------------------
        // TITLE
        // --------------------------------------------------------

        Paragraph title =
                new Paragraph(
                        "LabTrack Report",
                        titleFont
                );

        title.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(title);

        document.add(
                new Paragraph(" ")
        );

        // --------------------------------------------------------
        // REPORT INFORMATION
        // --------------------------------------------------------

        String reportTypeText =
                reportType == null
                        ? "FULL_REPORT"
                        : reportType.name();

        String fromText =
                fromDate == null
                        ? ""
                        : fromDate.toString();

        String toText =
                toDate == null
                        ? ""
                        : toDate.toString();

        String departmentText =
                departmentId == null
                        ? "All Departments"
                        : String.valueOf(
                                departmentId
                        );

        Paragraph information =
                new Paragraph(
                        "Report Type: "
                                + reportTypeText
                                + "    |    From: "
                                + fromText
                                + "    |    To: "
                                + toText
                                + "    |    Department: "
                                + departmentText,
                        normalFont
                );

        information.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(
                information
        );

        document.add(
                new Paragraph(" ")
        );

        // --------------------------------------------------------
        // REPORT SECTIONS
        // --------------------------------------------------------

        List<ReportSection> sections =
                buildSections(
                        report
                );

        if (sections.isEmpty()) {

            Paragraph noData =
                    new Paragraph(
                            "No report records found.",
                            normalFont
                    );

            noData.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(noData);

        } else {

            for (ReportSection section :
                    sections) {

                Paragraph heading =
                        new Paragraph(
                                section.title,
                                sectionFont
                        );

                document.add(
                        heading
                );

                document.add(
                        new Paragraph(" ")
                );

                if (section.rows.isEmpty()) {

                    Paragraph noData =
                            new Paragraph(
                                    "No records found for the selected department and date range.",
                                    normalFont
                            );

                    document.add(
                            noData
                    );

                } else {

                    addRowsToPdf(
                            document,
                            section.rows,
                            headerFont,
                            normalFont
                    );
                }

                document.add(
                        new Paragraph(" ")
                );
            }
        }

        document.close();

        return outputStream.toByteArray();
    }

    // ============================================================
    // PDF TABLE
    // ============================================================

    private void addRowsToPdf(
            Document document,
            List<Map<String, String>> rows,
            Font headerFont,
            Font normalFont
    ) {

        LinkedHashMap<String, String> columns =
                collectColumns(rows);

        if (columns.isEmpty()) {
            return;
        }

        PdfPTable table =
                new PdfPTable(
                        columns.size()
                );

        table.setWidthPercentage(100);
        table.setHeaderRows(1);
        table.setSplitRows(true);
        table.setSplitLate(false);
        table.setKeepTogether(false);
        table.setSpacingBefore(2F);
        table.setSpacingAfter(6F);

        applyPdfColumnWidths(
                table,
                columns
        );

        // --------------------------------------------------------
        // HEADER
        // --------------------------------------------------------

        for (String column :
                columns.keySet()) {

            PdfPCell cell =
                    new PdfPCell(
                            new Phrase(
                                    formatColumnName(column),
                                    headerFont
                            )
                    );

            cell.setHorizontalAlignment(
                    Element.ALIGN_CENTER
            );

            cell.setVerticalAlignment(
                    Element.ALIGN_MIDDLE
            );

            cell.setPadding(3F);
            cell.setNoWrap(false);

            table.addCell(cell);
        }

        // --------------------------------------------------------
        // DATA
        // --------------------------------------------------------

        for (Map<String, String> row :
                rows) {

            for (String column :
                    columns.keySet()) {

                String value =
                        safeValue(
                                row.get(column)
                        );

                PdfPCell cell =
                        new PdfPCell(
                                new Phrase(
                                        value,
                                        normalFont
                                )
                        );

                cell.setVerticalAlignment(
                        Element.ALIGN_MIDDLE
                );

                cell.setPadding(3F);
                cell.setNoWrap(false);

                table.addCell(cell);
            }
        }

        document.add(table);
    }

    // ============================================================
    // PDF COLUMN WIDTHS
    // ============================================================

    private void applyPdfColumnWidths(
            PdfPTable table,
            LinkedHashMap<String, String> columns
    ) {

        float[] widths =
                new float[columns.size()];

        int index = 0;

        for (String column :
                columns.keySet()) {

            widths[index++] =
                    getPdfColumnWeight(column);
        }

        table.setWidths(widths);
    }

    private float getPdfColumnWeight(
            String column
    ) {

        if (column == null) {
            return 10F;
        }

        String normalized =
                column.toLowerCase()
                        .replace(" ", "")
                        .replace("_", "");

        if (normalized.contains("remark")
                || normalized.contains("note")
                || normalized.contains("cause")
                || normalized.contains("purpose")
                || normalized.contains("reason")
                || normalized.contains("departmentclasssection")) {
            return 22F;
        }

        if (normalized.contains("transactiondate")
                || normalized.contains("maintenancedate")
                || normalized.contains("purchasedate")
                || normalized.contains("expirydate")
                || normalized.contains("warrantyuntil")
                || normalized.contains("amcstart")
                || normalized.contains("amcend")
                || normalized.contains("nextscheduleddate")) {
            return 15F;
        }

        if (normalized.contains("transactionnumber")
                || normalized.contains("equipmentcode")
                || normalized.contains("itemcode")
                || normalized.contains("serialnumber")
                || normalized.contains("invoicenumber")
                || normalized.contains("purchaseordernumber")
                || normalized.contains("batchnumber")) {
            return 13F;
        }

        if (normalized.contains("itemname")
                || normalized.contains("equipmentname")
                || normalized.contains("supplier")
                || normalized.contains("performedby")
                || normalized.contains("responsible")
                || normalized.contains("manufacturer")
                || normalized.contains("location")
                || normalized.contains("provider")) {
            return 17F;
        }

        return 11F;
    }

    // ============================================================
    // EXCEL GENERATION
    // ============================================================

    private byte[] generateExcel(
            ReportResponseDTO report
    ) throws Exception {

        try (
                Workbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            Sheet sheet =
                    workbook.createSheet(
                            "Report"
                    );

            // ----------------------------------------------------
            // STYLES
            // ----------------------------------------------------

            org.apache.poi.ss.usermodel.Font titleFont =
                    workbook.createFont();

            titleFont.setBold(true);
            titleFont.setFontHeightInPoints(
                    (short) 16
            );

            org.apache.poi.ss.usermodel.Font sectionFont =
                    workbook.createFont();

            sectionFont.setBold(true);
            sectionFont.setFontHeightInPoints(
                    (short) 12
            );

            org.apache.poi.ss.usermodel.Font headerFont =
                    workbook.createFont();

            headerFont.setBold(true);

            CellStyle titleStyle =
                    workbook.createCellStyle();

            titleStyle.setFont(
                    titleFont
            );

            CellStyle sectionStyle =
                    workbook.createCellStyle();

            sectionStyle.setFont(
                    sectionFont
            );

            CellStyle headerStyle =
                    workbook.createCellStyle();

            headerStyle.setFont(
                    headerFont
            );

            headerStyle.setWrapText(
                    true
            );

            headerStyle.setVerticalAlignment(
                    org.apache.poi.ss.usermodel.VerticalAlignment.CENTER
            );

            CellStyle dataStyle =
                    workbook.createCellStyle();

            dataStyle.setWrapText(
                    true
            );

            dataStyle.setVerticalAlignment(
                    org.apache.poi.ss.usermodel.VerticalAlignment.CENTER
            );

            // ----------------------------------------------------
            // TOP INFORMATION
            // ----------------------------------------------------

            int rowNumber = 0;

            Row titleRow =
                    sheet.createRow(
                            rowNumber++
                    );

            Cell titleCell =
                    titleRow.createCell(0);

            titleCell.setCellValue(
                    "LabTrack Report"
            );

            titleCell.setCellStyle(
                    titleStyle
            );

            Row reportTypeRow =
                    sheet.createRow(
                            rowNumber++
                    );

            reportTypeRow
                    .createCell(0)
                    .setCellValue(
                            "Report Type"
                    );

            reportTypeRow
                    .createCell(1)
                    .setCellValue(
                            report == null
                                    || report.getReportType() == null
                                    ? ""
                                    : String.valueOf(
                                            report.getReportType()
                                    )
                    );

            Row fromDateRow =
                    sheet.createRow(
                            rowNumber++
                    );

            fromDateRow
                    .createCell(0)
                    .setCellValue(
                            "From Date"
                    );

            fromDateRow
                    .createCell(1)
                    .setCellValue(
                            report == null
                                    ? ""
                                    : safeValue(
                                            report.getFromDate()
                                    )
                    );

            Row toDateRow =
                    sheet.createRow(
                            rowNumber++
                    );

            toDateRow
                    .createCell(0)
                    .setCellValue(
                            "To Date"
                    );

            toDateRow
                    .createCell(1)
                    .setCellValue(
                            report == null
                                    ? ""
                                    : safeValue(
                                            report.getToDate()
                                    )
                    );

            Row departmentRow =
                    sheet.createRow(
                            rowNumber++
                    );

            departmentRow
                    .createCell(0)
                    .setCellValue(
                            "Department"
                    );

            departmentRow
                    .createCell(1)
                    .setCellValue(
                            report == null
                                    || report.getDepartmentId() == null
                                    ? "All Departments"
                                    : String.valueOf(
                                            report.getDepartmentId()
                                    )
                    );

            rowNumber++;

            // ----------------------------------------------------
            // REPORT SECTIONS
            // ----------------------------------------------------

            List<ReportSection> sections =
                    buildSections(
                            report
                    );

            if (sections.isEmpty()) {

                Row noDataRow =
                        sheet.createRow(
                                rowNumber
                        );

                noDataRow
                        .createCell(0)
                        .setCellValue(
                                "No report records found."
                        );

            } else {

                for (ReportSection section :
                        sections) {

                    // --------------------------------------------
                    // SECTION TITLE
                    // --------------------------------------------

                    Row sectionRow =
                            sheet.createRow(
                                    rowNumber++
                            );

                    Cell sectionCell =
                            sectionRow.createCell(
                                    0
                            );

                    sectionCell.setCellValue(
                            section.title
                    );

                    sectionCell.setCellStyle(
                            sectionStyle
                    );

                    // --------------------------------------------
                    // EMPTY SECTION
                    // --------------------------------------------

                    if (section.rows.isEmpty()) {

                        Row noDataRow =
                                sheet.createRow(
                                        rowNumber++
                                );

                        noDataRow
                                .createCell(0)
                                .setCellValue(
                                        "No records found for the selected department and date range."
                                );

                        rowNumber++;

                        continue;
                    }

                    // --------------------------------------------
                    // SECTION TABLE
                    // --------------------------------------------

                    LinkedHashMap<String, String> columns =
                            collectColumns(
                                    section.rows
                            );

                    Row headerRow =
                            sheet.createRow(
                                    rowNumber++
                            );

                    int columnIndex = 0;

                    for (String column :
                            columns.keySet()) {

                        Cell cell =
                                headerRow.createCell(
                                        columnIndex++
                                );

                        cell.setCellValue(
                                formatColumnName(
                                        column
                                )
                        );

                        cell.setCellStyle(
                                headerStyle
                        );
                    }

                    // --------------------------------------------
                    // SECTION DATA
                    // --------------------------------------------

                    for (Map<String, String> data :
                            section.rows) {

                        Row excelRow =
                                sheet.createRow(
                                        rowNumber++
                                );

                        columnIndex = 0;

                        for (String column :
                                columns.keySet()) {

                            Cell cell =
                                    excelRow.createCell(
                                            columnIndex++
                                    );

                            cell.setCellValue(
                                    safeValue(
                                            data.get(column)
                                    )
                            );

                            cell.setCellStyle(
                                    dataStyle
                            );
                        }
                    }

                    // --------------------------------------------
                    // SPACE BETWEEN SECTIONS
                    // --------------------------------------------

                    rowNumber++;
                }
            }

            // ----------------------------------------------------
            // COLUMN WIDTH
            // ----------------------------------------------------

            int maxColumns =
                    findMaximumColumnCount(
                            sections
                    );

            maxColumns =
                    Math.max(
                            maxColumns,
                            4
                    );

            for (
                    int i = 0;
                    i < maxColumns;
                    i++
            ) {

                sheet.autoSizeColumn(i);

                int width =
                        sheet.getColumnWidth(i);

                width =
                        Math.max(width, 3000);

                width =
                        Math.min(width, 18000);

                sheet.setColumnWidth(
                        i,
                        width
                );
            }

            applyExcelColumnWidths(
                    sheet,
                    sections
            );
            sheet.createFreezePane(
                    0,
                    6
            );

            workbook.write(
                    outputStream
            );

            return outputStream.toByteArray();
        }
    }

    // ============================================================
    // EXCEL COLUMN WIDTHS
    // ============================================================

    private void applyExcelColumnWidths(
            Sheet sheet,
            List<ReportSection> sections
    ) {

        int maxColumns =
                findMaximumColumnCount(sections);

        for (int columnIndex = 0;
             columnIndex < maxColumns;
             columnIndex++) {

            String columnName =
                    findColumnNameAtIndex(
                            sections,
                            columnIndex
                    );

            if (columnName == null) {
                continue;
            }

            int width =
                    getExcelColumnWidth(columnName);

            if (width > 0) {
                sheet.setColumnWidth(
                        columnIndex,
                        width
                );
            }
        }
    }

    private String findColumnNameAtIndex(
            List<ReportSection> sections,
            int columnIndex
    ) {

        for (ReportSection section : sections) {

            LinkedHashMap<String, String> columns =
                    collectColumns(section.rows);

            if (columnIndex < columns.size()) {
                return new ArrayList<>(
                        columns.keySet()
                ).get(columnIndex);
            }
        }

        return null;
    }

    private int getExcelColumnWidth(
            String column
    ) {

        if (column == null) {
            return 4000;
        }

        String normalized =
                column.toLowerCase();

        if (normalized.contains("remark")
                || normalized.contains("note")
                || normalized.contains("cause")
                || normalized.contains("purpose")
                || normalized.contains("reason")) {
            return 12000;
        }

        if (normalized.contains("transactiondate")
                || normalized.contains("maintenancedate")
                || normalized.contains("purchasedate")
                || normalized.contains("expirydate")
                || normalized.contains("warrantyuntil")
                || normalized.contains("amcstart")
                || normalized.contains("amcend")
                || normalized.contains("nextscheduleddate")
                || normalized.contains("datetime")) {
            return 6000;
        }

        if (normalized.contains("transactionnumber")
                || normalized.contains("equipmentcode")
                || normalized.contains("itemcode")
                || normalized.contains("invoicenumber")
                || normalized.contains("purchaseordernumber")
                || normalized.contains("batchnumber")) {
            return 7000;
        }

        if (normalized.contains("itemname")
                || normalized.contains("equipmentname")
                || normalized.contains("supplier")
                || normalized.contains("performedby")
                || normalized.contains("responsible")) {
            return 8500;
        }

        return 5000;
    }

    // ============================================================
    // BUILD REPORT SECTIONS
    // ============================================================

    private List<ReportSection> buildSections(
            ReportResponseDTO report
    ) {

        if (report == null) {
            return Collections.emptyList();
        }

        List<Map<String, String>> rows =
                flattenReportRows(report);

        ReportType reportType =
                report.getReportType();

        if (reportType == null) {
            reportType =
                    ReportType.FULL_REPORT;
        }

        if (reportType != ReportType.FULL_REPORT) {

            String title =
                    formatReportTypeTitle(
                            reportType
                    );

            return List.of(
                    new ReportSection(
                            title,
                            rows
                    )
            );
        }

        return buildFullReportSections(
                rows
        );
    }

    // ============================================================
    // FULL REPORT SECTIONS
    // ============================================================

    private List<ReportSection> buildFullReportSections(
            List<Map<String, String>> rows
    ) {

        List<ReportSection> sections =
                new ArrayList<>();

        List<Map<String, String>> inventory =
                rowsMatchingColumns(
                        rows,
                        "itemCode",
                        "itemName",
                        "category",
                        "type",
                        "unit",
                        "openingStock",
                        "currentStock",
                        "minimumStock",
                        "maximumStock",
                        "supplier",
                        "storageLocation",
                        "expiryDate"
                );

        sections.add(
                new ReportSection(
                        "Inventory / Items",
                        inventory
                )
        );

        List<Map<String, String>> transactions =
                rowsMatchingColumns(
                        rows,
                        "transactionNumber",
                        "itemCode",
                        "itemName",
                        "transactionType",
                        "quantity",
                        "transactionDate",
                        "performedBy",
                        "remarks"
                );

        sections.add(
                new ReportSection(
                        "Stock In",
                        filterValue(
                                transactions,
                                "transactionType",
                                "STOCK_IN"
                        )
                )
        );

        sections.add(
                new ReportSection(
                        "Stock Out",
                        filterValue(
                                transactions,
                                "transactionType",
                                "STOCK_OUT"
                        )
                )
        );

        List<Map<String, String>> expiry =
                rowsMatchingColumns(
                        rows,
                        "itemCode",
                        "itemName",
                        "category",
                        "expiryDate",
                        "currentStock",
                        "supplier",
                        "status"
                );

        sections.add(
                new ReportSection(
                        "Expiry",
                        expiry
                )
        );

        List<Map<String, String>> supplierPurchases =
                rowsMatchingColumns(
                        rows,
                        "supplier",
                        "itemCode",
                        "itemName",
                        "purchaseDate",
                        "purchasePrice",
                        "invoiceNumber",
                        "purchaseOrderNumber",
                        "batchNumber"
                );

        sections.add(
                new ReportSection(
                        "Supplier-wise Purchases",
                        supplierPurchases
                )
        );

        List<Map<String, String>> supplierItems =
                rowsMatchingColumns(
                        rows,
                        "supplier",
                        "itemCount",
                        "totalCurrentStock",
                        "totalPurchaseValue"
                );

        sections.add(
                new ReportSection(
                        "Supplier-wise Items",
                        supplierItems
                )
        );

        List<Map<String, String>> equipment =
                rowsMatchingColumns(
                        rows,
                        "equipmentCode",
                        "equipmentName",
                        "category",
                        "manufacturer",
                        "model",
                        "serialNumber",
                        "purchaseDate",
                        "purchaseCost",
                        "warrantyUntil",
                        "location",
                        "status"
                );

        sections.add(
                new ReportSection(
                        "Equipment Register",
                        equipment
                )
        );

        List<Map<String, String>> warranty =
                rowsMatchingColumns(
                        rows,
                        "equipmentCode",
                        "equipmentName",
                        "manufacturer",
                        "warrantyUntil",
                        "status"
                );

        sections.add(
                new ReportSection(
                        "Warranty",
                        warranty
                )
        );

        List<Map<String, String>> amc =
                rowsMatchingColumns(
                        rows,
                        "equipmentCode",
                        "equipmentName",
                        "provider",
                        "contact",
                        "amcStart",
                        "amcEnd",
                        "costPerYear",
                        "amcType",
                        "status"
                );

        sections.add(
                new ReportSection(
                        "AMC",
                        amc
                )
        );

        List<Map<String, String>> amcExpiry =
                rowsMatchingColumns(
                        rows,
                        "equipmentCode",
                        "equipmentName",
                        "provider",
                        "amcEnd",
                        "costPerYear",
                        "status"
                );

        sections.add(
                new ReportSection(
                        "AMC Expiry",
                        amcExpiry
                )
        );

        List<Map<String, String>> maintenanceHistory =
                rowsMatchingColumns(
                        rows,
                        "equipmentCode",
                        "equipmentName",
                        "maintenanceDate",
                        "maintenanceType",
                        "performedBy",
                        "cost",
                        "nextScheduledDate",
                        "notes"
                );

        sections.add(
                new ReportSection(
                        "Maintenance History",
                        maintenanceHistory
                )
        );

        List<Map<String, String>> maintenanceCost =
                rowsMatchingColumns(
                        rows,
                        "equipment",
                        "maintenanceCount",
                        "totalCost"
                );

        sections.add(
                new ReportSection(
                        "Maintenance Cost",
                        maintenanceCost
                )
        );

        List<Map<String, String>> breakageRows =
                rowsMatchingColumns(
                        rows,
                        "dateTime",
                        "item",
                        "itemCode",
                        "quantity",
                        "responsibleName",
                        "personType",
                        "responsibleId",
                        "department",
                        "cause",
                        "estimatedCost",
                        "recoveryStatus",
                        "remarks"
                );

        List<Map<String, String>> breakageRegister =
                extractBreakageRegisterRows(
                        breakageRows
                );

        sections.add(
                new ReportSection(
                        "Breakage Register",
                        breakageRegister
                )
        );

        List<Map<String, String>> departmentBreakage =
                rowsMatchingColumns(
                        rows,
                        "department",
                        "breakageCount",
                        "quantity",
                        "cost"
                );

        sections.add(
                new ReportSection(
                        "Department-wise Breakage",
                        departmentBreakage
                )
        );

        List<Map<String, String>> personBreakage =
                rowsMatchingColumns(
                        rows,
                        "person",
                        "personType",
                        "breakageCount",
                        "quantity",
                        "cost"
                );

        sections.add(
                new ReportSection(
                        "Person-wise Breakage",
                        personBreakage
                )
        );

        List<Map<String, String>> recoveryRows =
                extractRecoveryRows(
                        breakageRows
                );

        sections.add(
                new ReportSection(
                        "Pending Recovery",
                        filterValue(
                                recoveryRows,
                                "recoveryStatus",
                                "PENDING"
                        )
                )
        );

        sections.add(
                new ReportSection(
                        "Paid Recovery",
                        filterValue(
                                recoveryRows,
                                "recoveryStatus",
                                "PAID"
                        )
                )
        );

        sections.add(
                new ReportSection(
                        "Waived Recovery",
                        filterValue(
                                recoveryRows,
                                "recoveryStatus",
                                "WAIVED"
                        )
                )
        );

        List<Map<String, String>> breakageCost =
                rowsMatchingColumns(
                        rows,
                        "item",
                        "breakageCount",
                        "quantity",
                        "totalCost"
                );

        sections.add(
                new ReportSection(
                        "Breakage Cost",
                        breakageCost
                )
        );

        return sections;
    }

    // ============================================================
    // BREAKAGE REGISTER EXTRACTION
    // ============================================================

    private List<Map<String, String>> extractBreakageRegisterRows(
            List<Map<String, String>> breakageRows
    ) {

        if (breakageRows.isEmpty()) {
            return new ArrayList<>();
        }

        /*
         * FULL_REPORT adds the breakage register first and then
         * adds one recovery copy for every original breakage
         * whose recovery status is PENDING, PAID or WAIVED.
         *
         * Therefore the same breakage records occur twice in
         * this combined row list. The first half is the original
         * Breakage Register section.
         */
        int registerCount =
                breakageRows.size() / 2;

        return new ArrayList<>(
                breakageRows.subList(
                        0,
                        registerCount
                )
        );
    }

    // ============================================================
    // RECOVERY EXTRACTION
    // ============================================================

    private List<Map<String, String>> extractRecoveryRows(
            List<Map<String, String>> breakageRows
    ) {

        if (breakageRows.isEmpty()) {
            return new ArrayList<>();
        }

        /*
         * The recovery rows are the second half of the combined
         * breakage row list produced by FULL_REPORT.
         */
        int registerCount =
                breakageRows.size() / 2;

        if (registerCount >= breakageRows.size()) {
            return new ArrayList<>();
        }

        return new ArrayList<>(
                breakageRows.subList(
                        registerCount,
                        breakageRows.size()
                )
        );
    }

    // ============================================================
    // MATCH COLUMNS
    // ============================================================

    private List<Map<String, String>> rowsMatchingColumns(
            List<Map<String, String>> rows,
            String... expectedColumns
    ) {

        List<Map<String, String>> result =
                new ArrayList<>();

        for (Map<String, String> row :
                rows) {

            if (hasColumns(
                    row,
                    expectedColumns
            )) {

                result.add(row);
            }
        }

        return result;
    }

    // ============================================================
    // COLUMN CHECK
    // ============================================================

    private boolean hasColumns(
            Map<String, String> row,
            String... expectedColumns
    ) {

        if (row == null
                || row.isEmpty()) {

            return false;
        }

        /*
         * The ReportService normally puts every field into the
         * row map, including fields whose value is null. Older
         * exported workbooks, however, may contain rows where
         * empty fields were omitted. Therefore an exact key-count
         * comparison would incorrectly lose valid rows.
         *
         * We accept rows whose keys belong to the expected schema
         * and then use identifying fields for schemas that overlap.
         */

        java.util.Set<String> expected =
                new java.util.HashSet<>(
                        java.util.Arrays.asList(
                                expectedColumns
                        )
                );

        if (!expected.containsAll(
                row.keySet()
        )) {

            return false;
        }

        // --------------------------------------------------------
        // TRANSACTION SCHEMA
        // --------------------------------------------------------

        if (expected.contains(
                "transactionNumber"
        )) {

            return row.containsKey(
                    "transactionNumber"
            ) && row.containsKey(
                    "transactionType"
            );
        }

        // --------------------------------------------------------
        // INVENTORY / ITEMS
        // --------------------------------------------------------

        if (expected.contains(
                "openingStock"
        )) {

            return row.containsKey(
                    "itemCode"
            ) && row.containsKey(
                    "itemName"
            );
        }

        // --------------------------------------------------------
        // EXPIRY
        // --------------------------------------------------------

        if (expected.contains(
                "expiryDate"
        )
                && expected.contains(
                        "status"
                )
                && expected.contains(
                        "currentStock"
                )
                && !expected.contains(
                        "openingStock"
                )) {

            return row.containsKey(
                    "expiryDate"
            );
        }

        // --------------------------------------------------------
        // SUPPLIER PURCHASES
        // --------------------------------------------------------

        if (expected.contains(
                "purchasePrice"
        )) {

            return row.containsKey(
                    "purchaseDate"
            ) && row.containsKey(
                    "supplier"
            );
        }

        // --------------------------------------------------------
        // SUPPLIER ITEMS
        // --------------------------------------------------------

        if (expected.contains(
                "itemCount"
        )
                && expected.contains(
                        "totalCurrentStock"
                )) {

            return row.containsKey(
                    "supplier"
            );
        }

        // --------------------------------------------------------
        // EQUIPMENT REGISTER
        // --------------------------------------------------------

        if (expected.contains(
                "purchaseCost"
        )
                && expected.contains(
                        "serialNumber"
                )) {

            return row.containsKey(
                    "equipmentCode"
            ) && row.containsKey(
                    "equipmentName"
            );
        }

        // --------------------------------------------------------
        // WARRANTY
        // --------------------------------------------------------

        if (expected.contains(
                "warrantyUntil"
        )
                && expected.contains(
                        "manufacturer"
        )
                && !expected.contains(
                        "purchaseCost"
                )) {

            return row.containsKey(
                    "equipmentCode"
            ) && row.containsKey(
                    "equipmentName"
            );
        }

        // --------------------------------------------------------
        // AMC
        // --------------------------------------------------------

        if (expected.contains(
                "amcStart"
        )
                && expected.contains(
                        "amcType"
                )) {

            return row.containsKey(
                    "equipmentCode"
            ) && row.containsKey(
                    "equipmentName"
            );
        }

        // --------------------------------------------------------
        // AMC EXPIRY
        // --------------------------------------------------------

        if (expected.contains(
                "provider"
        )
                && expected.contains(
                        "amcEnd"
                )
                && !expected.contains(
                        "amcStart"
                )) {

            return row.containsKey(
                    "equipmentCode"
            ) && row.containsKey(
                    "equipmentName"
            );
        }

        // --------------------------------------------------------
        // MAINTENANCE HISTORY
        // --------------------------------------------------------

        if (expected.contains(
                "maintenanceDate"
        )) {

            return row.containsKey(
                    "equipmentCode"
            ) && row.containsKey(
                    "equipmentName"
            );
        }

        // --------------------------------------------------------
        // MAINTENANCE COST
        // --------------------------------------------------------

        if (expected.contains(
                "maintenanceCount"
        )) {

            return row.containsKey(
                    "equipment"
            );
        }

        // --------------------------------------------------------
        // DEPARTMENT BREAKAGE
        // --------------------------------------------------------

        if (expected.contains(
                "breakageCount"
        )
                && expected.contains(
                        "department"
                )) {

            return row.containsKey(
                    "department"
            );
        }

        // --------------------------------------------------------
        // PERSON BREAKAGE
        // --------------------------------------------------------

        if (expected.contains(
                "breakageCount"
        )
                && expected.contains(
                        "person"
                )) {

            return row.containsKey(
                    "person"
            );
        }

        // --------------------------------------------------------
        // BREAKAGE COST
        // --------------------------------------------------------

        if (expected.contains(
                "totalCost"
        )
                && expected.contains(
                        "item"
                )) {

            return row.containsKey(
                    "item"
            );
        }

        // --------------------------------------------------------
        // BREAKAGE REGISTER
        // --------------------------------------------------------

        if (expected.contains(
                "responsibleName"
        )) {

            return row.containsKey(
                    "dateTime"
            ) && row.containsKey(
                    "itemCode"
            );
        }

        return true;
    }

    // ============================================================
    // VALUE FILTER
    // ============================================================

    private List<Map<String, String>> filterValue(
            List<Map<String, String>> rows,
            String column,
            String expected
    ) {

        List<Map<String, String>> result =
                new ArrayList<>();

        for (Map<String, String> row :
                rows) {

            if (
                    expected.equals(
                            safeValue(
                                    row.get(column)
                            )
                    )
            ) {

                result.add(row);
            }
        }

        return result;
    }

    // ============================================================
    // COUNT VALUE
    // ============================================================

    private int countValue(
            List<Map<String, String>> rows,
            String column,
            String expected
    ) {

        int count = 0;

        for (Map<String, String> row :
                rows) {

            if (
                    expected.equals(
                            safeValue(
                                    row.get(column)
                            )
                    )
            ) {

                count++;
            }
        }

        return count;
    }

    // ============================================================
    // FLATTEN REPORT ROWS
    // ============================================================

    private List<Map<String, String>> flattenReportRows(
            ReportResponseDTO report
    ) {

        List<Map<String, String>> result =
                new ArrayList<>();

        if (report == null) {
            return result;
        }

        if (report.getRows() == null) {
            return result;
        }

        for (ReportRowDTO reportRow :
                report.getRows()) {

            if (reportRow == null) {
                continue;
            }

            Map<String, Object> values =
                    reportRow.getValues();

            if (values == null
                    || values.isEmpty()) {

                continue;
            }

            Map<String, String> row =
                    new LinkedHashMap<>();

            for (
                    Map.Entry<String, Object> entry :
                    values.entrySet()
            ) {

                row.put(
                        entry.getKey(),
                        flattenValue(
                                entry.getValue()
                        )
                );
            }

            result.add(row);
        }

        return result;
    }

    // ============================================================
    // SAFE VALUE CONVERSION
    // ============================================================

    private String flattenValue(
            Object value
    ) {

        if (value == null) {
            return "";
        }

        if (value instanceof String
                || value instanceof Number
                || value instanceof Boolean
                || value instanceof Character
                || value instanceof Enum<?>) {

            return String.valueOf(value);
        }

        if (value instanceof LocalDateTime) {
            return ((LocalDateTime) value)
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }

        if (value instanceof LocalDate) {
            return ((LocalDate) value)
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }

        if (value instanceof LocalTime) {
            return ((LocalTime) value)
                    .format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        }

        if (value instanceof Collection<?>) {

            List<String> values =
                    new ArrayList<>();

            for (Object item :
                    (Collection<?>) value) {

                values.add(
                        flattenValue(item)
                );
            }

            return String.join(
                    ", ",
                    values
            );
        }

        if (value.getClass().isArray()) {

            int length =
                    java.lang.reflect.Array
                            .getLength(value);

            List<String> values =
                    new ArrayList<>();

            for (
                    int i = 0;
                    i < length;
                    i++
            ) {

                Object item =
                        java.lang.reflect.Array
                                .get(
                                        value,
                                        i
                                );

                values.add(
                        flattenValue(item)
                );
            }

            return String.join(
                    ", ",
                    values
            );
        }

        if (value instanceof Map<?, ?>) {

            List<String> values =
                    new ArrayList<>();

            for (
                    Map.Entry<?, ?> entry :
                    ((Map<?, ?>) value).entrySet()
            ) {

                values.add(
                        String.valueOf(
                                entry.getKey()
                        )
                                + ": "
                                + flattenValue(
                                        entry.getValue()
                                )
                );
            }

            return String.join(
                    ", ",
                    values
            );
        }

        return extractEntityDisplayValue(
                value
        );
    }

    // ============================================================
    // ENTITY DISPLAY VALUE
    // ============================================================

    private String extractEntityDisplayValue(
            Object entity
    ) {

        String[] preferredFields = {
                "name",
                "categoryName",
                "departmentName",
                "itemName",
                "equipmentName",
                "supplierName",
                "manufacturerName",
                "brandName",
                "fullName",
                "code",
                "itemCode",
                "equipmentCode",
                "serialNumber",
                "id"
        };

        for (String fieldName :
                preferredFields) {

            String value =
                    readField(
                            entity,
                            fieldName
                    );

            if (value != null
                    && !value.isBlank()) {

                return value;
            }
        }

        String className =
                entity.getClass()
                        .getSimpleName();

        if (className.contains("$")) {

            className =
                    className.substring(
                            0,
                            className.indexOf('$')
                    );
        }

        return className;
    }

    // ============================================================
    // READ ENTITY FIELD
    // ============================================================

    private String readField(
            Object object,
            String fieldName
    ) {

        Class<?> currentClass =
                object.getClass();

        while (
                currentClass != null
                        && currentClass != Object.class
        ) {

            try {

                Field field =
                        currentClass.getDeclaredField(
                                fieldName
                        );

                field.setAccessible(true);

                Object value =
                        field.get(object);

                if (value == null) {
                    return null;
                }

                if (isSimpleValue(value)) {

                    return String.valueOf(
                            value
                    );
                }

                return extractEntityDisplayValue(
                        value
                );

            } catch (
                    NoSuchFieldException exception
            ) {

                currentClass =
                        currentClass.getSuperclass();

            } catch (
                    IllegalAccessException
                    | SecurityException exception
            ) {

                return null;
            }
        }

        return null;
    }

    // ============================================================
    // SIMPLE VALUE CHECK
    // ============================================================

    private boolean isSimpleValue(
            Object value
    ) {

        return value instanceof String
                || value instanceof Number
                || value instanceof Boolean
                || value instanceof Character
                || value instanceof Enum<?>
                || value instanceof LocalDate
                || value instanceof LocalDateTime
                || value instanceof LocalTime;
    }

    // ============================================================
    // COLLECT COLUMNS
    // ============================================================

    private LinkedHashMap<String, String> collectColumns(
            List<Map<String, String>> rows
    ) {

        LinkedHashMap<String, String> columns =
                new LinkedHashMap<>();

        for (Map<String, String> row :
                rows) {

            for (String key :
                    row.keySet()) {

                columns.putIfAbsent(
                        key,
                        key
                );
            }
        }

        return columns;
    }

    // ============================================================
    // FORMAT COLUMN NAME
    // ============================================================

    private String formatColumnName(
            String value
    ) {

        if (
                value == null
                        || value.isBlank()
        ) {

            return "";
        }

        String result =
                value.replaceAll(
                        "([a-z])([A-Z])",
                        "$1 $2"
                );

        result =
                result.replace(
                        "_",
                        " "
                );

        return result
                .substring(
                        0,
                        1
                )
                .toUpperCase()
                + result.substring(1);
    }

    // ============================================================
    // REPORT TYPE TITLE
    // ============================================================

    private String formatReportTypeTitle(
            ReportType reportType
    ) {

        if (reportType == null) {
            return "Report Details";
        }

        switch (reportType) {

            case INVENTORY_STOCK:
                return "Inventory / Items";

            case LOW_STOCK:
                return "Low Stock";

            case OUT_OF_STOCK:
                return "Out of Stock";

            case STOCK_IN:
                return "Stock In";

            case STOCK_OUT:
                return "Stock Out";

            case DAILY_CONSUMABLES:
                return "Daily Consumables";

            case EXPIRY:
                return "Expiry";

            case SUPPLIER_PURCHASES:
                return "Supplier-wise Purchases";

            case SUPPLIER_ITEMS:
                return "Supplier-wise Items";

            case EQUIPMENT_REGISTER:
                return "Equipment Register";

            case WARRANTY:
                return "Warranty";

            case AMC:
                return "AMC";

            case AMC_EXPIRY:
                return "AMC Expiry";

            case MAINTENANCE_HISTORY:
                return "Maintenance History";

            case MAINTENANCE_COST:
                return "Maintenance Cost";

            case BREAKAGE_REGISTER:
                return "Breakage Register";

            case DEPARTMENT_BREAKAGE:
                return "Department-wise Breakage";

            case PERSON_BREAKAGE:
                return "Person-wise Breakage";

            case PENDING_RECOVERY:
                return "Pending Recovery";

            case PAID_RECOVERY:
                return "Paid Recovery";

            case WAIVED_RECOVERY:
                return "Waived Recovery";

            case BREAKAGE_COST:
                return "Breakage Cost";

            case FULL_REPORT:
            default:
                return "Report Details";
        }
    }

    // ============================================================
    // MAXIMUM COLUMN COUNT
    // ============================================================

    private int findMaximumColumnCount(
            List<ReportSection> sections
    ) {

        int maximum = 0;

        for (ReportSection section :
                sections) {

            maximum =
                    Math.max(
                            maximum,
                            collectColumns(
                                    section.rows
                            ).size()
                    );
        }

        return maximum;
    }

    // ============================================================
    // SAFE STRING
    // ============================================================

    private String safeValue(
            Object value
    ) {

        if (value == null) {
            return "";
        }

        return flattenValue(value);
    }

    // ============================================================
    // REPORT SECTION
    // ============================================================

    private static class ReportSection {

        private final String title;

        private final List<Map<String, String>> rows;

        private ReportSection(
                String title,
                List<Map<String, String>> rows
        ) {

            this.title =
                    title;

            this.rows =
                    rows == null
                            ? new ArrayList<>()
                            : rows;
        }
    }
}
