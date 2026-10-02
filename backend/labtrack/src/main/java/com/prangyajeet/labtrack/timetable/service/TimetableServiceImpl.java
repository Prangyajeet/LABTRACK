package com.prangyajeet.labtrack.timetable.service;

import com.prangyajeet.labtrack.timetable.dto.LabOccupancyResponseDTO;
import com.prangyajeet.labtrack.timetable.dto.TimetableRequestDTO;
import com.prangyajeet.labtrack.timetable.dto.TimetableResponseDTO;
import com.prangyajeet.labtrack.timetable.entity.Timetable;
import com.prangyajeet.labtrack.timetable.repository.TimetableRepository;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import java.nio.charset.StandardCharsets;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;

import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.TextStyle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class TimetableServiceImpl
        implements TimetableService {

    private static final ZoneId LABTRACK_ZONE =
        ZoneId.of("Asia/Kolkata");


    private final TimetableRepository timetableRepository;


    public TimetableServiceImpl(
        TimetableRepository timetableRepository
    ) {

        this.timetableRepository =
            timetableRepository;
    }


    // =========================================================
    // CREATE
    // =========================================================

    @Override
    @Transactional
    public TimetableResponseDTO createTimetable(
        TimetableRequestDTO request
    ) {

        validateRequest(request);


        Timetable timetable =
            new Timetable();


        mapRequestToEntity(
            request,
            timetable
        );


        LocalDateTime now =
            LocalDateTime.now(
                LABTRACK_ZONE
            );


        timetable.setStatus(
            "SCHEDULED"
        );


        timetable.setCreatedAt(
            now
        );


        timetable.setUpdatedAt(
            now
        );


        return mapToResponse(
            timetableRepository.save(
                timetable
            )
        );
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    @Transactional
    public TimetableResponseDTO updateTimetable(
        Long id,
        TimetableRequestDTO request
    ) {

        validateRequest(request);


        Timetable timetable =
            findById(id);


        mapRequestToEntity(
            request,
            timetable
        );


        timetable.setStatus(
            "SCHEDULED"
        );


        timetable.setUpdatedAt(
            LocalDateTime.now(
                LABTRACK_ZONE
            )
        );


        return mapToResponse(
            timetableRepository.save(
                timetable
            )
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    @Override
    @Transactional
    public void deleteTimetable(
        Long id
    ) {

        findById(id);

        timetableRepository.deleteById(
            id
        );
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public TimetableResponseDTO getTimetableById(
        Long id
    ) {

        return mapToResponse(
            findById(id)
        );
    }


    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<TimetableResponseDTO>
    getAllTimetables() {

        return timetableRepository
            .findAll()
            .stream()
            .sorted(
                (a, b) -> {

                    int dayCompare =
                        dayNumber(
                            a.getDay()
                        )
                        -
                        dayNumber(
                            b.getDay()
                        );


                    if (
                        dayCompare != 0
                    ) {

                        return dayCompare;
                    }


                    if (
                        a.getTimeFrom() == null &&
                        b.getTimeFrom() == null
                    ) {

                        return 0;
                    }


                    if (
                        a.getTimeFrom() == null
                    ) {

                        return 1;
                    }


                    if (
                        b.getTimeFrom() == null
                    ) {

                        return -1;
                    }


                    return a.getTimeFrom()
                        .compareTo(
                            b.getTimeFrom()
                        );
                }
            )
            .map(
                this::mapToResponse
            )
            .toList();
    }


    // =========================================================
    // GET BY DATE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<TimetableResponseDTO>
    getTimetableByDate(
        LocalDate date
    ) {

        if (date == null) {

            throw new IllegalArgumentException(
                "Date is required."
            );
        }


        if (
            date.getDayOfWeek()
                == DayOfWeek.SUNDAY
        ) {

            return List.of();
        }


        String day =
            date.getDayOfWeek()
                .getDisplayName(
                    TextStyle.FULL,
                    Locale.ENGLISH
                );


        return timetableRepository
            .findByDateOrDayIgnoreCaseOrderByTimeFromAsc(
                date,
                day
            )
            .stream()
            .map(
                this::mapToResponse
            )
            .toList();
    }


    // =========================================================
    // GET BY DATE + LAB
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<TimetableResponseDTO>
    getTimetableByDateAndLab(
        LocalDate date,
        String lab
    ) {

        if (date == null) {

            throw new IllegalArgumentException(
                "Date is required."
            );
        }


        if (
            date.getDayOfWeek()
                == DayOfWeek.SUNDAY
        ) {

            return List.of();
        }


        if (
            lab == null ||
            lab.trim().isEmpty()
        ) {

            return getTimetableByDate(
                date
            );
        }


        String day =
            date.getDayOfWeek()
                .getDisplayName(
                    TextStyle.FULL,
                    Locale.ENGLISH
                );


        return timetableRepository
            .findByDayIgnoreCaseAndLabIgnoreCaseOrderByTimeFromAsc(
                day,
                lab.trim()
            )
            .stream()
            .map(
                this::mapToResponse
            )
            .toList();
    }


    // =========================================================
    // LIVE LAB OCCUPANCY
    // =========================================================
    //
    // IMPORTANT:
    //
    // This returns ONE row per laboratory.
    //
    // Therefore the frontend can display:
    //
    //     EMT          OCCUPIED
    //     CCU          VACANT
    //     Central Lab  VACANT
    //
    // instead of displaying only occupied classes.
    //
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<LabOccupancyResponseDTO>
    getLabOccupancy(
        LocalDate date,
        String lab
    ) {

        if (date == null) {

            throw new IllegalArgumentException(
                "Date is required."
            );
        }


        /*
         * Sunday has no laboratory classes.
         */

        if (
            date.getDayOfWeek()
                == DayOfWeek.SUNDAY
        ) {

            return List.of();
        }


        /*
         * Occupancy means CURRENT status.
         */

        LocalDateTime indiaNow =
            LocalDateTime.now(
                LABTRACK_ZONE
            );


        LocalDate today =
            indiaNow.toLocalDate();


        /*
         * Only today can have live occupancy.
         */

        if (
            !date.equals(today)
        ) {

            return List.of();
        }


        String day =
            date.getDayOfWeek()
                .getDisplayName(
                    TextStyle.FULL,
                    Locale.ENGLISH
                );


        /*
         * Load schedule.
         */

        List<Timetable> records;


        if (
            lab == null ||
            lab.trim().isEmpty()
        ) {

            records =
                timetableRepository
                    .findByDayIgnoreCaseOrderByTimeFromAsc(
                        day
                    );

        } else {

            records =
                timetableRepository
                    .findByDayIgnoreCaseAndLabIgnoreCaseOrderByTimeFromAsc(
                        day,
                        lab.trim()
                    );
        }


        /*
         * Remove records without a laboratory.
         *
         * A laboratory cannot be displayed as free/occupied
         * if no laboratory name exists.
         */

        records =
            records
                .stream()
                .filter(
                    timetable ->
                        timetable.getLab() != null
                        &&
                        !timetable.getLab()
                            .isBlank()
                )
                .toList();


        /*
         * Group all timetable records by laboratory.
         *
         * LinkedHashMap preserves the timetable order.
         */

        Map<String, List<Timetable>>
            labs =
                new LinkedHashMap<>();


        for (
            Timetable timetable :
            records
        ) {

            String labName =
                timetable.getLab()
                    .trim();


            labs.computeIfAbsent(
                labName,
                key ->
                    new ArrayList<>()
            ).add(
                timetable
            );
        }


        LocalTime now =
            indiaNow.toLocalTime();


        List<LabOccupancyResponseDTO>
            result =
            new ArrayList<>();


        /*
         * =====================================================
         * CALCULATE EACH LAB
         * =====================================================
         */

        for (
            Map.Entry<String, List<Timetable>>
                entry :
                labs.entrySet()
        ) {

            String labName =
                entry.getKey();


            List<Timetable>
                labRecords =
                entry.getValue();


            /*
             * Find currently running classes.
             */

            List<Timetable>
                activeRecords =
                labRecords
                    .stream()
                    .filter(
                        timetable ->
                            isWithinTime(
                                timetable,
                                now
                            )
                    )
                    .toList();


            /*
             * -------------------------------------------------
             * CURRENT CLASS EXISTS
             * -------------------------------------------------
             */

            if (
                !activeRecords.isEmpty()
            ) {

                /*
                 * Find an active class that has NOT been
                 * manually marked vacant.
                 */

                Timetable occupiedRecord =
                    activeRecords
                        .stream()
                        .filter(
                            timetable ->
                                !isManualVacant(
                                    timetable,
                                    today
                                )
                        )
                        .findFirst()
                        .orElse(null);


                /*
                 * At least one active class is still occupying
                 * the laboratory.
                 */

                if (
                    occupiedRecord != null
                ) {

                    result.add(
                        mapToOccupancy(
                            occupiedRecord,
                            date,
                            "OCCUPIED"
                        )
                    );

                    continue;
                }


                /*
                 * All currently active classes were manually
                 * marked vacant.
                 */

                Timetable vacantRecord =
                    activeRecords.get(0);


                result.add(
                    mapToOccupancy(
                        vacantRecord,
                        date,
                        "VACANT"
                    )
                );

                continue;
            }


            /*
             * -------------------------------------------------
             * NO CURRENT CLASS
             * -------------------------------------------------
             *
             * The laboratory is free now.
             *
             * We use the first timetable record only to retain
             * the laboratory identity.
             *
             * We deliberately remove class/time information
             * from the occupancy response so that a future
             * class is not mistakenly displayed as running.
             */

            /*
             * The laboratory is free right now, but the occupancy
             * table should still show useful timetable information.
             *
             * Prefer the next upcoming class. If the day's schedule
             * has already finished, use the last scheduled class as
             * the reference row.
             */
            Timetable reference =
                labRecords
                    .stream()
                    .filter(
                        timetable ->
                            timetable.getTimeFrom() != null
                            &&
                            timetable.getTimeFrom()
                                .isAfter(now)
                    )
                    .findFirst()
                    .orElse(
                        labRecords.get(
                            labRecords.size() - 1
                        )
                    );


            result.add(
                mapToVacantLab(
                    reference,
                    date
                )
            );
        }


        return result;
    }


    // =========================================================
    // MANUAL OCCUPANCY STATUS
    // =========================================================
    //
    // VACANT:
    //
    //     Admin says the active lab is actually free.
    //
    // SCHEDULED:
    //
    //     Restore automatic occupancy calculation.
    //
    // The updatedAt date is used so a manual VACANT override
    // applies only to today's occurrence.
    //
    // =========================================================

    @Override
    @Transactional
    public TimetableResponseDTO
    updateOccupancyStatus(
        Long id,
        String status
    ) {

        if (id == null) {

            throw new IllegalArgumentException(
                "Timetable ID is required."
            );
        }


        if (
            status == null ||
            status.trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                "Occupancy status is required."
            );
        }


        String normalized =
            status.trim()
                .toUpperCase();


        if (
            !normalized.equals("VACANT")
            &&
            !normalized.equals("SCHEDULED")
        ) {

            throw new IllegalArgumentException(
                "Occupancy status must be VACANT or SCHEDULED."
            );
        }


        Timetable timetable =
            findById(id);


        /*
         * We only allow manual vacancy for a timetable
         * record that represents today's day.
         */

        LocalDate today =
            LocalDateTime
                .now(
                    LABTRACK_ZONE
                )
                .toLocalDate();


        String todayDay =
            today.getDayOfWeek()
                .getDisplayName(
                    TextStyle.FULL,
                    Locale.ENGLISH
                );


        if (
            !todayDay.equalsIgnoreCase(
                timetable.getDay()
            )
        ) {

            throw new IllegalArgumentException(
                "Manual occupancy status can only be changed "
                + "for today's timetable."
            );
        }


        timetable.setStatus(
            normalized
        );


        timetable.setUpdatedAt(
            LocalDateTime.now(
                LABTRACK_ZONE
            )
        );


        return mapToResponse(
            timetableRepository.save(
                timetable
            )
        );
    }


    // =========================================================
    // CHECK CURRENT TIME
    // =========================================================

    private boolean isWithinTime(
        Timetable timetable,
        LocalTime now
    ) {

        if (
            timetable == null
            ||
            timetable.getTimeFrom() == null
            ||
            timetable.getTimeTo() == null
        ) {

            return false;
        }


        return (
            !now.isBefore(
                timetable.getTimeFrom()
            )
            &&
            now.isBefore(
                timetable.getTimeTo()
            )
        );
    }


    // =========================================================
    // MANUAL VACANT CHECK
    // =========================================================

    private boolean isManualVacant(
        Timetable timetable,
        LocalDate today
    ) {

        if (
            timetable == null
            ||
            !"VACANT".equalsIgnoreCase(
                timetable.getStatus()
            )
        ) {

            return false;
        }


        /*
         * VACANT is only a current-day override.
         */

        if (
            timetable.getUpdatedAt() == null
        ) {

            return false;
        }


        LocalDate updatedDate =
            timetable
                .getUpdatedAt()
                .toLocalDate();


        return updatedDate.equals(
            today
        );
    }


    // =========================================================
    // MAP OCCUPIED / VACANT ACTIVE CLASS
    // =========================================================

    private LabOccupancyResponseDTO
    mapToOccupancy(
        Timetable timetable,
        LocalDate selectedDate,
        String status
    ) {

        LabOccupancyResponseDTO dto =
            new LabOccupancyResponseDTO();


        dto.setDate(
            selectedDate
        );


        dto.setDay(
            timetable.getDay()
        );


        dto.setTimeFrom(
            timetable.getTimeFrom()
        );


        dto.setTimeTo(
            timetable.getTimeTo()
        );


        dto.setLab(
            timetable.getLab()
        );


        dto.setFaculty(
            timetable.getFaculty()
        );


        dto.setSubject(
            timetable.getSubject()
        );


        dto.setClassName(
            timetable.getClassName()
        );


        dto.setStatus(
            status
        );


        return dto;
    }


    // =========================================================
    // MAP FREE LAB
    // =========================================================

    private LabOccupancyResponseDTO
    mapToVacantLab(
        Timetable timetable,
        LocalDate selectedDate
    ) {

        LabOccupancyResponseDTO dto =
            new LabOccupancyResponseDTO();


        dto.setDate(
            selectedDate
        );


        dto.setDay(
            timetable.getDay()
        );


        /*
         * The laboratory is currently free, but we keep the
         * reference timetable information visible so the user can
         * see the relevant scheduled slot, faculty and subject.
         *
         * The STATUS remains VACANT because the class is not running.
         */

        dto.setTimeFrom(
            timetable.getTimeFrom()
        );


        dto.setTimeTo(
            timetable.getTimeTo()
        );


        dto.setLab(
            timetable.getLab()
        );


        dto.setFaculty(
            timetable.getFaculty()
        );


        dto.setSubject(
            timetable.getSubject()
        );


        dto.setClassName(
            timetable.getClassName()
        );


        dto.setStatus(
            "VACANT"
        );


        return dto;
    }


    // =========================================================
    // MAP RESPONSE
    // =========================================================

    private TimetableResponseDTO
    mapToResponse(
        Timetable timetable
    ) {

        TimetableResponseDTO dto =
            new TimetableResponseDTO();


        dto.setId(
            timetable.getId()
        );


        dto.setDate(
            timetable.getDate()
        );


        dto.setDay(
            timetable.getDay()
        );


        dto.setTimeFrom(
            timetable.getTimeFrom()
        );


        dto.setTimeTo(
            timetable.getTimeTo()
        );


        dto.setFaculty(
            timetable.getFaculty()
        );


        dto.setLab(
            timetable.getLab()
        );


        dto.setSubject(
            timetable.getSubject()
        );


        dto.setClassName(
            timetable.getClassName()
        );


        /*
         * Old VACANT overrides are treated as normal scheduled
         * records when returned through the normal timetable API.
         *
         * This prevents a Friday manual override from affecting
         * the next Friday's normal Faculty Schedule.
         */

        String responseStatus =
            timetable.getStatus();


        LocalDate today =
            LocalDateTime
                .now(
                    LABTRACK_ZONE
                )
                .toLocalDate();


        if (
            "VACANT".equalsIgnoreCase(
                responseStatus
            )
            &&
            (
                timetable.getUpdatedAt() == null
                ||
                !timetable.getUpdatedAt()
                    .toLocalDate()
                    .equals(today)
            )
        ) {

            responseStatus =
                "SCHEDULED";
        }


        if (
            responseStatus == null ||
            responseStatus.isBlank()
        ) {

            responseStatus =
                "SCHEDULED";
        }


        dto.setStatus(
            responseStatus
        );


        dto.setCreatedAt(
            timetable.getCreatedAt()
        );


        dto.setUpdatedAt(
            timetable.getUpdatedAt()
        );


        return dto;
    }


    // =========================================================
    // FILE UPLOAD
    // =========================================================

    @Override
    @Transactional
    public List<TimetableResponseDTO>
    uploadTimetable(
        MultipartFile file
    ) {

        validateUploadFile(
            file
        );


        String fileName =
            file.getOriginalFilename();


        String extension =
            getExtension(
                fileName
            );


        try {

            if (
                extension.equals("xlsx") ||
                extension.equals("xls")
            ) {

                return importExcel(
                    file
                );
            }


            if (
                extension.equals("csv")
            ) {

                return importCsv(
                    file
                );
            }


            throw new IllegalArgumentException(
                "Unsupported timetable file."
            );

        } catch (
            IOException e
        ) {

            throw new RuntimeException(
                "Unable to read timetable file.",
                e
            );
        }
    }


    // =========================================================
    // IMPORT EXCEL
    // =========================================================

    private List<TimetableResponseDTO>
    importExcel(
        MultipartFile file
    ) throws IOException {

        List<TimetableResponseDTO>
            imported =
                new ArrayList<>();


        try (
            InputStream inputStream =
                file.getInputStream();

            Workbook workbook =
                createWorkbook(
                    inputStream,
                    file.getOriginalFilename()
                )
        ) {

            Sheet sheet =
                workbook.getSheetAt(0);


            if (
                sheet.getPhysicalNumberOfRows()
                    < 2
            ) {

                throw new IllegalArgumentException(
                    "Timetable file does not contain data."
                );
            }


            int headerRowIndex =
                findHeaderRow(
                    sheet
                );


            if (
                headerRowIndex < 0
            ) {

                throw new IllegalArgumentException(
                    "Unable to find timetable header row. "
                    + "Expected a column named Day."
                );
            }


            Row headerRow =
                sheet.getRow(
                    headerRowIndex
                );


            Map<String, Integer>
                columns =
                readHeaders(
                    headerRow
                );


            validateColumns(
                columns
            );


            System.out.println(
                "TIMETABLE EXCEL HEADER ROW: "
                + (
                    headerRowIndex + 1
                )
            );


            System.out.println(
                "TIMETABLE EXCEL COLUMNS: "
                + columns
            );


            DataFormatter formatter =
                new DataFormatter();


            for (
                int rowIndex =
                    headerRowIndex + 1;

                rowIndex <=
                    sheet.getLastRowNum();

                rowIndex++
            ) {

                Row row =
                    sheet.getRow(
                        rowIndex
                    );


                if (
                    row == null ||
                    isEmptyRow(row)
                ) {

                    continue;
                }


                String day =
                    getCell(
                        row,
                        columns,
                        "day",
                        formatter
                    );


                /*
                 * Skip section rows:
                 *
                 * Thursday (10 lab sessions)
                 * Friday (13 lab sessions)
                 */

                if (
                    !isValidDayValue(
                        day
                    )
                ) {

                    continue;
                }


                Timetable timetable;


                try {

                    timetable =
                        parseExcelRow(
                            row,
                            columns,
                            formatter
                        );

                } catch (
                    IllegalArgumentException e
                ) {

                    throw new IllegalArgumentException(
                        "Invalid timetable data at Excel row "
                        + (
                            rowIndex + 1
                        )
                        + ": "
                        + e.getMessage()
                    );
                }


                timetableRepository.save(
                    timetable
                );


                imported.add(
                    mapToResponse(
                        timetable
                    )
                );
            }
        }


        if (
            imported.isEmpty()
        ) {

            throw new IllegalArgumentException(
                "No valid timetable records were found."
            );
        }


        return imported;
    }


    // =========================================================
    // FIND HEADER
    // =========================================================

    private int findHeaderRow(
        Sheet sheet
    ) {

        for (
            int rowIndex = 0;

            rowIndex <=
                sheet.getLastRowNum();

            rowIndex++
        ) {

            Row row =
                sheet.getRow(
                    rowIndex
                );


            if (
                row == null
            ) {

                continue;
            }


            Map<String, Integer>
                columns =
                readHeaders(
                    row
                );


            boolean hasDay =
                columns.containsKey(
                    "day"
                );


            boolean hasTime =
                columns.containsKey(
                    "timefrom"
                )
                ||
                columns.containsKey(
                    "timeto"
                );


            boolean hasOther =
                columns.containsKey(
                    "lab"
                )
                ||
                columns.containsKey(
                    "faculty"
                )
                ||
                columns.containsKey(
                    "subject"
                );


            if (
                hasDay
                &&
                (
                    hasTime ||
                    hasOther
                )
            ) {

                return rowIndex;
            }
        }


        return -1;
    }


    // =========================================================
    // IMPORT CSV
    // =========================================================

    private List<TimetableResponseDTO>
    importCsv(
        MultipartFile file
    ) throws IOException {

        List<TimetableResponseDTO>
            imported =
                new ArrayList<>();


        try (
            BufferedReader reader =
                new BufferedReader(
                    new InputStreamReader(
                        file.getInputStream(),
                        StandardCharsets.UTF_8
                    )
                )
        ) {

            String headerLine =
                reader.readLine();


            if (
                headerLine == null ||
                headerLine.trim().isEmpty()
            ) {

                throw new IllegalArgumentException(
                    "CSV file is empty."
                );
            }


            String[] headers =
                splitCsvLine(
                    headerLine
                );


            Map<String, Integer>
                columns =
                readCsvHeaders(
                    headers
                );


            validateColumns(
                columns
            );


            String line;

            int rowNumber = 1;


            while (
                (
                    line =
                        reader.readLine()
                ) != null
            ) {

                rowNumber++;


                if (
                    line.trim().isEmpty()
                ) {

                    continue;
                }


                String[] values =
                    splitCsvLine(
                        line
                    );


                String day =
                    getCsvValue(
                        values,
                        columns,
                        "day"
                    );


                if (
                    !isValidDayValue(
                        day
                    )
                ) {

                    continue;
                }


                Timetable timetable =
                    parseCsvRow(
                        values,
                        columns,
                        rowNumber
                    );


                timetableRepository.save(
                    timetable
                );


                imported.add(
                    mapToResponse(
                        timetable
                    )
                );
            }
        }


        if (
            imported.isEmpty()
        ) {

            throw new IllegalArgumentException(
                "No valid timetable records were found."
            );
        }


        return imported;
    }


    // =========================================================
    // PARSE EXCEL ROW
    // =========================================================

    private Timetable parseExcelRow(
        Row row,
        Map<String, Integer> columns,
        DataFormatter formatter
    ) {

        Timetable timetable =
            new Timetable();


        String day =
            getCell(
                row,
                columns,
                "day",
                formatter
            );


        String timeFrom =
            getCell(
                row,
                columns,
                "timefrom",
                formatter
            );


        String timeTo =
            getCell(
                row,
                columns,
                "timeto",
                formatter
            );


        String faculty =
            getCell(
                row,
                columns,
                "faculty",
                formatter
            );


        String lab =
            getCell(
                row,
                columns,
                "lab",
                formatter
            );


        String subject =
            getCell(
                row,
                columns,
                "subject",
                formatter
            );


        String className =
            getCell(
                row,
                columns,
                "class",
                formatter
            );


        String dateValue =
            getCell(
                row,
                columns,
                "date",
                formatter
            );


        timetable.setDate(
            dateValue == null ||
            dateValue.trim().isEmpty()
                ? null
                : parseDate(
                    dateValue
                )
        );


        timetable.setDay(
            normalizeDay(
                day
            )
        );


        timetable.setTimeFrom(
            parseTime(
                timeFrom
            )
        );


        timetable.setTimeTo(
            parseTime(
                timeTo
            )
        );


        timetable.setFaculty(
            emptyToNull(
                faculty
            )
        );


        timetable.setLab(
            emptyToNull(
                lab
            )
        );


        timetable.setSubject(
            emptyToNull(
                subject
            )
        );


        timetable.setClassName(
            emptyToNull(
                className
            )
        );


        timetable.setStatus(
            "SCHEDULED"
        );


        LocalDateTime now =
            LocalDateTime.now(
                LABTRACK_ZONE
            );


        timetable.setCreatedAt(
            now
        );


        timetable.setUpdatedAt(
            now
        );


        validateImportedRecord(
            timetable
        );


        return timetable;
    }


    // =========================================================
    // PARSE CSV ROW
    // =========================================================

    private Timetable parseCsvRow(
        String[] values,
        Map<String, Integer> columns,
        int rowNumber
    ) {

        Timetable timetable =
            new Timetable();


        try {

            String day =
                getCsvValue(
                    values,
                    columns,
                    "day"
                );


            String timeFrom =
                getCsvValue(
                    values,
                    columns,
                    "timefrom"
                );


            String timeTo =
                getCsvValue(
                    values,
                    columns,
                    "timeto"
                );


            String faculty =
                getCsvValue(
                    values,
                    columns,
                    "faculty"
                );


            String lab =
                getCsvValue(
                    values,
                    columns,
                    "lab"
                );


            String subject =
                getCsvValue(
                    values,
                    columns,
                    "subject"
                );


            String className =
                getCsvValue(
                    values,
                    columns,
                    "class"
                );


            String dateValue =
                getCsvValue(
                    values,
                    columns,
                    "date"
                );


            timetable.setDate(
                dateValue == null ||
                dateValue.trim().isEmpty()
                    ? null
                    : parseDate(
                        dateValue
                    )
            );


            timetable.setDay(
                normalizeDay(
                    day
                )
            );


            timetable.setTimeFrom(
                parseTime(
                    timeFrom
                )
            );


            timetable.setTimeTo(
                parseTime(
                    timeTo
                )
            );


            timetable.setFaculty(
                emptyToNull(
                    faculty
                )
            );


            timetable.setLab(
                emptyToNull(
                    lab
                )
            );


            timetable.setSubject(
                emptyToNull(
                    subject
                )
            );


            timetable.setClassName(
                emptyToNull(
                    className
                )
            );


            timetable.setStatus(
                "SCHEDULED"
            );


            LocalDateTime now =
                LocalDateTime.now(
                    LABTRACK_ZONE
                );


            timetable.setCreatedAt(
                now
            );


            timetable.setUpdatedAt(
                now
            );


            validateImportedRecord(
                timetable
            );


            return timetable;

        } catch (
            Exception e
        ) {

            throw new IllegalArgumentException(
                "Invalid timetable data at CSV row "
                + rowNumber
                + ": "
                + e.getMessage()
            );
        }
    }


    // =========================================================
    // WORKBOOK
    // =========================================================

    private Workbook createWorkbook(
        InputStream inputStream,
        String fileName
    ) throws IOException {

        String extension =
            getExtension(
                fileName
            );


        if (
            extension.equals("xlsx")
        ) {

            return new XSSFWorkbook(
                inputStream
            );
        }


        return new HSSFWorkbook(
            inputStream
        );
    }


    // =========================================================
    // HEADERS
    // =========================================================

    private Map<String, Integer>
    readHeaders(
        Row headerRow
    ) {

        Map<String, Integer>
            columns =
                new HashMap<>();


        if (
            headerRow == null
        ) {

            return columns;
        }


        DataFormatter formatter =
            new DataFormatter();


        short lastCellNum =
            headerRow.getLastCellNum();


        if (
            lastCellNum < 0
        ) {

            return columns;
        }


        for (
            int i = 0;
            i < lastCellNum;
            i++
        ) {

            Cell cell =
                headerRow.getCell(
                    i
                );


            if (
                cell == null
            ) {

                continue;
            }


            String header =
                formatter
                    .formatCellValue(
                        cell
                    );


            String normalized =
                normalizeHeader(
                    header
                );


            if (
                normalized.isEmpty()
            ) {

                continue;
            }


            String mapped =
                mapHeaderAlias(
                    normalized
                );


            columns.put(
                mapped,
                i
            );
        }


        return columns;
    }


    // =========================================================
    // HEADER ALIASES
    // =========================================================

    private String mapHeaderAlias(
        String header
    ) {

        return switch (
            header
        ) {

            case "day",
                 "weekday",
                 "dayofweek" ->
                "day";


            case "start",
                 "from",
                 "starttime",
                 "timefrom",
                 "timebegin",
                 "begintime" ->
                "timefrom";


            case "end",
                 "to",
                 "endtime",
                 "timeto",
                 "timeend" ->
                "timeto";


            case "lab",
                 "room",
                 "labroom",
                 "laboratory",
                 "laboratoryroom" ->
                "lab";


            case "faculty",
                 "facultyname",
                 "teacher",
                 "teachername",
                 "instructor",
                 "instructorname" ->
                "faculty";


            case "subject",
                 "subjectname",
                 "course",
                 "coursename" ->
                "subject";


            case "class",
                 "classname",
                 "classtype",
                 "section",
                 "batch" ->
                "class";


            case "date",
                 "timetabledate",
                 "scheduledate" ->
                "date";


            default ->
                header;
        };
    }


    // =========================================================
    // CSV HEADERS
    // =========================================================

    private Map<String, Integer>
    readCsvHeaders(
        String[] headers
    ) {

        Map<String, Integer>
            columns =
            new HashMap<>();


        for (
            int i = 0;
            i < headers.length;
            i++
        ) {

            String normalized =
                normalizeHeader(
                    headers[i]
                );


            if (
                normalized.isEmpty()
            ) {

                continue;
            }


            String mapped =
                mapHeaderAlias(
                    normalized
                );


            columns.put(
                mapped,
                i
            );
        }


        return columns;
    }


    // =========================================================
    // REQUIRED COLUMNS
    // =========================================================

    private void validateColumns(
        Map<String, Integer> columns
    ) {

        String[] required = {

            "day",
            "timefrom",
            "timeto"

        };


        for (
            String column :
            required
        ) {

            if (
                !columns.containsKey(
                    column
                )
            ) {

                throw new IllegalArgumentException(
                    "Missing required timetable column: "
                    + column
                );
            }
        }
    }


    // =========================================================
    // GET CELL
    // =========================================================

    private String getCell(
        Row row,
        Map<String, Integer> columns,
        String column,
        DataFormatter formatter
    ) {

        Integer index =
            columns.get(
                column
            );


        if (
            index == null
        ) {

            return "";
        }


        Cell cell =
            row.getCell(
                index
            );


        if (
            cell == null
        ) {

            return "";
        }


        return formatter
            .formatCellValue(
                cell
            )
            .trim();
    }


    // =========================================================
    // GET CSV VALUE
    // =========================================================

    private String getCsvValue(
        String[] values,
        Map<String, Integer> columns,
        String column
    ) {

        Integer index =
            columns.get(
                column
            );


        if (
            index == null ||
            index >= values.length
        ) {

            return "";
        }


        return values[index]
            .trim();
    }


    // =========================================================
    // NORMALIZE HEADER
    // =========================================================

    private String normalizeHeader(
        String header
    ) {

        if (
            header == null
        ) {

            return "";
        }


        return header
            .trim()
            .toLowerCase()
            .replace(
                "\u00A0",
                " "
            )
            .replace(
                "_",
                ""
            )
            .replace(
                "-",
                ""
            )
            .replace(
                "/",
                ""
            )
            .replace(
                "\\",
                ""
            )
            .replace(
                "&",
                ""
            )
            .replace(
                "(",
                ""
            )
            .replace(
                ")",
                ""
            )
            .replace(
                " ",
                ""
            );
    }


    // =========================================================
    // VALID DAY
    // =========================================================

    private boolean isValidDayValue(
        String day
    ) {

        if (
            day == null ||
            day.trim().isEmpty()
        ) {

            return false;
        }


        String normalized =
            day.trim()
                .toLowerCase();


        return switch (
            normalized
        ) {

            case "mon",
                 "monday",
                 "tue",
                 "tues",
                 "tuesday",
                 "wed",
                 "wednesday",
                 "thu",
                 "thur",
                 "thurs",
                 "thursday",
                 "fri",
                 "friday",
                 "sat",
                 "saturday",
                 "sun",
                 "sunday" ->
                true;


            default ->
                false;
        };
    }


    // =========================================================
    // NORMALIZE DAY
    // =========================================================

    private String normalizeDay(
        String day
    ) {

        if (
            day == null ||
            day.trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                "Day is required."
            );
        }


        String normalized =
            day.trim()
                .toLowerCase();


        return switch (
            normalized
        ) {

            case "mon",
                 "monday" ->
                "Monday";


            case "tue",
                 "tues",
                 "tuesday" ->
                "Tuesday";


            case "wed",
                 "wednesday" ->
                "Wednesday";


            case "thu",
                 "thur",
                 "thurs",
                 "thursday" ->
                "Thursday";


            case "fri",
                 "friday" ->
                "Friday";


            case "sat",
                 "saturday" ->
                "Saturday";


            case "sun",
                 "sunday" ->
                "Sunday";


            default ->
                throw new IllegalArgumentException(
                    "Invalid day: "
                    + day
                );
        };
    }


    // =========================================================
    // PARSE TIME
    // =========================================================

    private LocalTime parseTime(
        String value
    ) {

        if (
            value == null ||
            value.trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                "Start and End time are required."
            );
        }


        String time =
            value.trim();


        List<DateTimeFormatter>
            formatters =
            List.of(

                DateTimeFormatter.ofPattern(
                    "H:mm"
                ),

                DateTimeFormatter.ofPattern(
                    "HH:mm"
                ),

                DateTimeFormatter.ofPattern(
                    "h:mm a",
                    Locale.ENGLISH
                ),

                DateTimeFormatter.ofPattern(
                    "hh:mm a",
                    Locale.ENGLISH
                )
            );


        for (
            DateTimeFormatter formatter :
            formatters
        ) {

            try {

                return LocalTime.parse(
                    time,
                    formatter
                );

            } catch (
                DateTimeParseException ignored
            ) {

            }
        }


        throw new IllegalArgumentException(
            "Invalid time: "
            + value
        );
    }


    // =========================================================
    // PARSE DATE
    // =========================================================

    private LocalDate parseDate(
        String value
    ) {

        if (
            value == null ||
            value.trim().isEmpty()
        ) {

            return null;
        }


        List<DateTimeFormatter>
            formatters =
            List.of(

                DateTimeFormatter.ISO_LOCAL_DATE,

                DateTimeFormatter.ofPattern(
                    "dd-MM-yyyy"
                ),

                DateTimeFormatter.ofPattern(
                    "dd/MM/yyyy"
                ),

                DateTimeFormatter.ofPattern(
                    "dd-MMM-yyyy",
                    Locale.ENGLISH
                )
            );


        for (
            DateTimeFormatter formatter :
            formatters
        ) {

            try {

                return LocalDate.parse(
                    value.trim(),
                    formatter
                );

            } catch (
                DateTimeParseException ignored
            ) {

            }
        }


        throw new IllegalArgumentException(
            "Invalid date: "
            + value
        );
    }


    // =========================================================
    // VALIDATE IMPORTED RECORD
    // =========================================================

    private void validateImportedRecord(
        Timetable timetable
    ) {

        if (
            timetable.getDay() == null ||
            timetable.getDay().isBlank()
        ) {

            throw new IllegalArgumentException(
                "Day is required."
            );
        }


        if (
            timetable.getTimeFrom() == null
        ) {

            throw new IllegalArgumentException(
                "Start time is required."
            );
        }


        if (
            timetable.getTimeTo() == null
        ) {

            throw new IllegalArgumentException(
                "End time is required."
            );
        }


        if (
            timetable.getTimeFrom()
                .compareTo(
                    timetable.getTimeTo()
                ) >= 0
        ) {

            throw new IllegalArgumentException(
                "Start time must be before End time."
            );
        }


        /*
         * Optional fields remain optional.
         */

        timetable.setFaculty(
            emptyToNull(
                timetable.getFaculty()
            )
        );


        timetable.setLab(
            emptyToNull(
                timetable.getLab()
            )
        );


        timetable.setSubject(
            emptyToNull(
                timetable.getSubject()
            )
        );


        timetable.setClassName(
            emptyToNull(
                timetable.getClassName()
            )
        );
    }


    // =========================================================
    // EMPTY ROW
    // =========================================================

    private boolean isEmptyRow(
        Row row
    ) {

        short lastCellNum =
            row.getLastCellNum();


        if (
            lastCellNum < 0
        ) {

            return true;
        }


        DataFormatter formatter =
            new DataFormatter();


        for (
            int i = 0;
            i < lastCellNum;
            i++
        ) {

            Cell cell =
                row.getCell(
                    i
                );


            if (
                cell != null
            ) {

                String value =
                    formatter
                        .formatCellValue(
                            cell
                        )
                        .trim();


                if (
                    !value.isEmpty()
                ) {

                    return false;
                }
            }
        }


        return true;
    }


    // =========================================================
    // CSV SPLITTER
    // =========================================================

    private String[] splitCsvLine(
        String line
    ) {

        List<String> values =
            new ArrayList<>();


        StringBuilder current =
            new StringBuilder();


        boolean insideQuotes =
            false;


        for (
            int i = 0;
            i < line.length();
            i++
        ) {

            char character =
                line.charAt(i);


            if (
                character == '"'
            ) {

                insideQuotes =
                    !insideQuotes;

            } else if (
                character == ',' &&
                !insideQuotes
            ) {

                values.add(
                    current
                        .toString()
                        .trim()
                );


                current.setLength(
                    0
                );

            } else {

                current.append(
                    character
                );
            }
        }


        values.add(
            current
                .toString()
                .trim()
        );


        return values.toArray(
            new String[0]
        );
    }


    // =========================================================
    // EMPTY TO NULL
    // =========================================================

    private String emptyToNull(
        String value
    ) {

        if (
            value == null ||
            value.trim().isEmpty()
        ) {

            return null;
        }


        return value.trim();
    }


    // =========================================================
    // DAY NUMBER
    // =========================================================

    private int dayNumber(
        String day
    ) {

        if (
            day == null
        ) {

            return 99;
        }


        return switch (
            day.toLowerCase()
        ) {

            case "monday" ->
                1;

            case "tuesday" ->
                2;

            case "wednesday" ->
                3;

            case "thursday" ->
                4;

            case "friday" ->
                5;

            case "saturday" ->
                6;

            case "sunday" ->
                7;

            default ->
                99;
        };
    }


    // =========================================================
    // EXTENSION
    // =========================================================

    private String getExtension(
        String fileName
    ) {

        if (
            fileName == null ||
            !fileName.contains(".")
        ) {

            throw new IllegalArgumentException(
                "File extension is required."
            );
        }


        return fileName
            .substring(
                fileName.lastIndexOf(".") + 1
            )
            .toLowerCase();
    }


    // =========================================================
    // VALIDATE UPLOAD
    // =========================================================

    private void validateUploadFile(
        MultipartFile file
    ) {

        if (
            file == null ||
            file.isEmpty()
        ) {

            throw new IllegalArgumentException(
                "Timetable file is required."
            );
        }


        String extension =
            getExtension(
                file.getOriginalFilename()
            );


        if (
            !extension.equals("xlsx") &&
            !extension.equals("xls") &&
            !extension.equals("csv")
        ) {

            throw new IllegalArgumentException(
                "Only XLS, XLSX and CSV timetable files are supported."
            );
        }
    }


    // =========================================================
    // FIND ENTITY
    // =========================================================

    private Timetable findById(
        Long id
    ) {

        return timetableRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new RuntimeException(
                        "Timetable record not found with ID: "
                        + id
                    )
            );
    }


    // =========================================================
    // VALIDATE MANUAL REQUEST
    // =========================================================

    private void validateRequest(
        TimetableRequestDTO request
    ) {

        if (
            request == null
        ) {

            throw new IllegalArgumentException(
                "Timetable request is required."
            );
        }


        if (
            request.getTimeFrom() == null ||
            request.getTimeTo() == null
        ) {

            throw new IllegalArgumentException(
                "Time From and Time To are required."
            );
        }


        if (
            !request.getTimeFrom()
                .isBefore(
                    request.getTimeTo()
                )
        ) {

            throw new IllegalArgumentException(
                "Time From must be before Time To."
            );
        }


        if (
            request.getDay() == null ||
            request.getDay().isBlank()
        ) {

            throw new IllegalArgumentException(
                "Day is required."
            );
        }


        /*
         * Faculty, Lab, Subject and Class are optional.
         */
    }


    // =========================================================
    // MAP REQUEST
    // =========================================================

    private void mapRequestToEntity(
        TimetableRequestDTO request,
        Timetable timetable
    ) {

        timetable.setDate(
            request.getDate()
        );


        timetable.setDay(
            normalizeDay(
                request.getDay()
            )
        );


        timetable.setTimeFrom(
            request.getTimeFrom()
        );


        timetable.setTimeTo(
            request.getTimeTo()
        );


        timetable.setFaculty(
            emptyToNull(
                request.getFaculty()
            )
        );


        timetable.setLab(
            emptyToNull(
                request.getLab()
            )
        );


        timetable.setSubject(
            emptyToNull(
                request.getSubject()
            )
        );


        timetable.setClassName(
            emptyToNull(
                request.getClassName()
            )
        );
    }
}