package com.prangyajeet.labtrack.supplier.export;

import com.prangyajeet.labtrack.supplier.entity.Supplier;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public final class SupplierExcelExporter {

    private SupplierExcelExporter() {
    }

    public static byte[] export(List<Supplier> suppliers) {

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()
        ) {

            Sheet sheet = workbook.createSheet("Suppliers");

            String[] columns = {
                    "ID",
                    "Supplier Code",
                    "Supplier Name",
                    "Contact Person",
                    "Email",
                    "Phone Number",
                    "Address",
                    "GST Number",
                    "Status"
            };

            // Header style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);

            // Create header row
            Row headerRow = sheet.createRow(0);

            for (int i = 0; i < columns.length; i++) {

                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Create data rows
            int rowNumber = 1;

            for (Supplier supplier : suppliers) {

                Row row = sheet.createRow(rowNumber++);

                row.createCell(0).setCellValue(
                        supplier.getId() != null
                                ? supplier.getId()
                                : 0
                );

                row.createCell(1).setCellValue(
                        safe(supplier.getSupplierCode())
                );

                row.createCell(2).setCellValue(
                        safe(supplier.getSupplierName())
                );

                row.createCell(3).setCellValue(
                        safe(supplier.getContactPerson())
                );

                row.createCell(4).setCellValue(
                        safe(supplier.getEmail())
                );

                row.createCell(5).setCellValue(
                        safe(supplier.getPhoneNumber())
                );

                row.createCell(6).setCellValue(
                        safe(supplier.getAddress())
                );

                row.createCell(7).setCellValue(
                        safe(supplier.getGstNumber())
                );

                row.createCell(8).setCellValue(
                        supplier.getStatus() != null
                                ? supplier.getStatus().name()
                                : ""
                );
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write workbook to byte array
            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Failed to generate supplier Excel file.",
                    exception
            );
        }
    }

    private static String safe(String value) {
        return value != null ? value : "";
    }
}