package com.prangyajeet.labtrack.item.export;

import com.prangyajeet.labtrack.item.entity.Item;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ItemExcelExporter {

    private ItemExcelExporter() {
    }

    public static byte[] export(List<Item> items) throws IOException {

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Items");

        Font headerFont = workbook.createFont();
        headerFont.setBold(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);

        String[] columns = {
                "ID",
                "Item Code",
                "Item Name",
                "Category",
                "Item Type",
                "Unit",
                "Opening Stock",
                "Current Stock",
                "Minimum Stock",
                "Maximum Stock",
                "Supplier",
                "Purchase Date",
                "Purchase Price",
                "Invoice Number",
                "Purchase Order Number",
                "Batch Number",
                "Storage Location",
                "Rack Number",
                "Expiry Date",
                "Description",
                "Remarks",
                "Status",
                "Created At"
        };

        Row headerRow = sheet.createRow(0);

        for (int i = 0; i < columns.length; i++) {

            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);

        }

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd-MM-yyyy");

        int rowNumber = 1;

        for (Item item : items) {

            Row row = sheet.createRow(rowNumber++);

            // ID
            row.createCell(0).setCellValue(item.getId());

            // Item Code
            row.createCell(1).setCellValue(item.getItemCode());

            // Item Name
            row.createCell(2).setCellValue(item.getItemName());

            // Category
            row.createCell(3).setCellValue(
                    item.getCategory() == null
                            ? ""
                            : item.getCategory().getCategoryName()
            );

            // Item Type
            row.createCell(4).setCellValue(
                    item.getItemType() == null
                            ? ""
                            : item.getItemType().name()
            );

            // Unit
            row.createCell(5).setCellValue(
                    item.getUnit() == null
                            ? ""
                            : item.getUnit()
            );

            // Opening Stock
            if (item.getOpeningStock() != null) {
                row.createCell(6).setCellValue(item.getOpeningStock());
            } else {
                row.createCell(6).setCellValue("");
            }

            // Current Stock
            if (item.getCurrentStock() != null) {
                row.createCell(7).setCellValue(item.getCurrentStock());
            } else {
                row.createCell(7).setCellValue("");
            }

            // Minimum Stock
            if (item.getMinimumStock() != null) {
                row.createCell(8).setCellValue(item.getMinimumStock());
            } else {
                row.createCell(8).setCellValue("");
            }

            // Maximum Stock
            if (item.getMaximumStock() != null) {
                row.createCell(9).setCellValue(item.getMaximumStock());
            } else {
                row.createCell(9).setCellValue("");
            }

            // Supplier
            row.createCell(10).setCellValue(
                    item.getSupplierName() == null
                            ? ""
                            : item.getSupplierName()
            );

            // Purchase Date
            row.createCell(11).setCellValue(
                    item.getPurchaseDate() == null
                            ? ""
                            : item.getPurchaseDate().format(formatter)
            );

            // Purchase Price
            if (item.getPurchasePrice() != null) {
                row.createCell(12).setCellValue(
                        item.getPurchasePrice().doubleValue()
                );
            } else {
                row.createCell(12).setCellValue("");
            }

            // Invoice Number
            row.createCell(13).setCellValue(
                    item.getInvoiceNumber() == null
                            ? ""
                            : item.getInvoiceNumber()
            );

            // Purchase Order Number
            row.createCell(14).setCellValue(
                    item.getPurchaseOrderNumber() == null
                            ? ""
                            : item.getPurchaseOrderNumber()
            );

            // Batch Number
            row.createCell(15).setCellValue(
                    item.getBatchNumber() == null
                            ? ""
                            : item.getBatchNumber()
            );

            // Storage Location
            row.createCell(16).setCellValue(
                    item.getStorageLocation() == null
                            ? ""
                            : item.getStorageLocation()
            );

            // Rack Number
            row.createCell(17).setCellValue(
                    item.getRackNumber() == null
                            ? ""
                            : item.getRackNumber()
            );

            // Expiry Date
            row.createCell(18).setCellValue(
                    item.getExpiryDate() == null
                            ? ""
                            : item.getExpiryDate().format(formatter)
            );

            // Description
            row.createCell(19).setCellValue(
                    item.getDescription() == null
                            ? ""
                            : item.getDescription()
            );

            // Remarks
            row.createCell(20).setCellValue(
                    item.getRemarks() == null
                            ? ""
                            : item.getRemarks()
            );

            // Status
            row.createCell(21).setCellValue(
                    item.getStatus() == null
                            ? ""
                            : item.getStatus().name()
            );

            // Created At
            row.createCell(22).setCellValue(
                    item.getCreatedAt() == null
                            ? ""
                            : item.getCreatedAt().toString()
            );
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }
}