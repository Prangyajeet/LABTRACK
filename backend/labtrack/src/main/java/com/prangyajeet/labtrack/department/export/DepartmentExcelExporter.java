package com.prangyajeet.labtrack.department.export;

import com.prangyajeet.labtrack.department.dto.DepartmentResponseDTO;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class DepartmentExcelExporter {

    /*
     * ============================================================
     * EXPORT DEPARTMENTS TO EXCEL
     * ============================================================
     */

    public byte[] export(
            List<DepartmentResponseDTO> departments) {

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
                    workbook.createSheet("Departments");

            /*
             * ====================================================
             * HEADER
             * ====================================================
             */

            Row headerRow =
                    sheet.createRow(0);

            String[] headers = {
                    "ID",
                    "Department Name",
                    "Description",
                    "Created At"
            };

            for (int i = 0; i < headers.length; i++) {

                Cell cell =
                        headerRow.createCell(i);

                cell.setCellValue(headers[i]);
            }

            /*
             * ====================================================
             * DATA
             * ====================================================
             */

            int rowIndex = 1;

            for (
                    DepartmentResponseDTO department
                    : departments
            ) {

                Row row =
                        sheet.createRow(rowIndex++);

                /*
                 * ID
                 */

                row.createCell(0)
                        .setCellValue(
                                department.getId() != null
                                        ? department.getId()
                                        : 0L
                        );

                /*
                 * Department Name
                 */

                row.createCell(1)
                        .setCellValue(
                                safeString(
                                        department.getDepartmentName()
                                )
                        );

                /*
                 * Description
                 */

                row.createCell(2)
                        .setCellValue(
                                safeString(
                                        department.getDescription()
                                )
                        );

                /*
                 * Created At
                 */

                row.createCell(3)
                        .setCellValue(
                                department.getCreatedAt() != null
                                        ? department
                                                .getCreatedAt()
                                                .toString()
                                        : ""
                        );
            }

            /*
             * ====================================================
             * AUTO SIZE
             * ====================================================
             */

            for (int i = 0; i < headers.length; i++) {

                sheet.autoSizeColumn(i);
            }

            /*
             * ====================================================
             * WRITE FILE
             * ====================================================
             */

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to export departments to Excel.",
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