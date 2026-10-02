package com.prangyajeet.labtrack.category.export;

import com.prangyajeet.labtrack.category.dto.CategoryResponseDTO;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class CategoryExcelExporter {

    /*
     * ============================================================
     * EXPORT CATEGORIES TO EXCEL
     * ============================================================
     */

    public byte[] export(
            List<CategoryResponseDTO> categories) {

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            /*
             * ====================================================
             * CREATE SHEET
             * ====================================================
             */

            Sheet sheet =
                    workbook.createSheet("Categories");

            /*
             * ====================================================
             * HEADER ROW
             * ====================================================
             */

            Row headerRow =
                    sheet.createRow(0);

            String[] headers = {
                    "ID",
                    "Department ID",
                    "Department Name",
                    "Category Name",
                    "Description",
                    "Status",
                    "Created At",
                    "Updated At"
            };

            for (int i = 0; i < headers.length; i++) {

                Cell cell =
                        headerRow.createCell(i);

                cell.setCellValue(headers[i]);
            }

            /*
             * ====================================================
             * DATA ROWS
             * ====================================================
             */

            int rowIndex = 1;

            for (
                    CategoryResponseDTO category
                    : categories
            ) {

                Row row =
                        sheet.createRow(rowIndex++);

                /*
                 * ID
                 */

                row.createCell(0)
                        .setCellValue(
                                category.getId() != null
                                        ? category.getId()
                                        : 0L
                        );

                /*
                 * Department ID
                 */

                row.createCell(1)
                        .setCellValue(
                                category.getDepartmentId() != null
                                        ? category.getDepartmentId()
                                        : 0L
                        );

                /*
                 * Department Name
                 */

                row.createCell(2)
                        .setCellValue(
                                safeString(
                                        category.getDepartmentName()
                                )
                        );

                /*
                 * Category Name
                 */

                row.createCell(3)
                        .setCellValue(
                                safeString(
                                        category.getCategoryName()
                                )
                        );

                /*
                 * Description
                 */

                row.createCell(4)
                        .setCellValue(
                                safeString(
                                        category.getDescription()
                                )
                        );

                /*
                 * Status
                 */

                row.createCell(5)
                        .setCellValue(
                                safeString(
                                        category.getStatus()
                                )
                        );

                /*
                 * Created At
                 */

                row.createCell(6)
                        .setCellValue(
                                category.getCreatedAt() != null
                                        ? category
                                                .getCreatedAt()
                                                .toString()
                                        : ""
                        );

                /*
                 * Updated At
                 */

                row.createCell(7)
                        .setCellValue(
                                category.getUpdatedAt() != null
                                        ? category
                                                .getUpdatedAt()
                                                .toString()
                                        : ""
                        );
            }

            /*
             * ====================================================
             * AUTO SIZE COLUMNS
             * ====================================================
             */

            for (int i = 0; i < headers.length; i++) {

                sheet.autoSizeColumn(i);
            }

            /*
             * ====================================================
             * WRITE WORKBOOK
             * ====================================================
             */

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to export categories to Excel.",
                    e
            );
        }
    }

    /*
     * ============================================================
     * SAFE STRING
     * ============================================================
     */

    private String safeString(String value) {

        return value != null
                ? value
                : "";
    }
}