package com.prangyajeet.labtrack.timetable.controller;

import com.prangyajeet.labtrack.timetable.dto.LabOccupancyResponseDTO;
import com.prangyajeet.labtrack.timetable.dto.TimetableRequestDTO;
import com.prangyajeet.labtrack.timetable.dto.TimetableResponseDTO;
import com.prangyajeet.labtrack.timetable.service.TimetableService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timetables")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(
        TimetableService timetableService
    ) {
        this.timetableService = timetableService;
    }

    // =========================================================
    // CREATE TIMETABLE
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimetableResponseDTO> createTimetable(

        @RequestBody TimetableRequestDTO request

    ) {

        return ResponseEntity.ok(

            timetableService.createTimetable(

                request

            )

        );

    }

    // =========================================================
    // UPLOAD TIMETABLE
    // =========================================================

    @PostMapping(
        value = "/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TimetableResponseDTO>> uploadTimetable(

        @RequestParam("file") MultipartFile file

    ) {

        return ResponseEntity.ok(

            timetableService.uploadTimetable(

                file

            )

        );

    }

    // =========================================================
    // GET TIMETABLE
    // =========================================================

    /*
     * Supported requests:
     *
     * GET /api/timetables
     *
     * GET /api/timetables?date=2026-09-03
     *
     * GET /api/timetables?date=2026-09-03&day=Thursday
     *
     * GET /api/timetables?date=2026-09-03&lab=ICU
     *
     * GET /api/timetables?date=2026-09-03&day=Thursday&lab=ICU
     *
     * =========================================================
     */

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<TimetableResponseDTO>> getTimetable(

        @RequestParam(required = false)
        LocalDate date,

        @RequestParam(required = false)
        String day,

        @RequestParam(required = false)
        String lab

    ) {

        // =====================================================
        // NO DATE
        // =====================================================

        if (date == null) {

            return ResponseEntity.ok(

                timetableService.getAllTimetables()

            );

        }

        // =====================================================
        // SUNDAY
        // =====================================================

        if (
            date.getDayOfWeek()
                == DayOfWeek.SUNDAY
        ) {

            return ResponseEntity.ok(

                List.of()

            );

        }

        // =====================================================
        // LABORATORY FILTER
        // =====================================================

        if (
            lab != null &&
            !lab.trim().isEmpty()
        ) {

            return ResponseEntity.ok(

                timetableService
                    .getTimetableByDateAndLab(

                        date,

                        lab.trim()

                    )

            );

        }

        // =====================================================
        // DATE FILTER
        // =====================================================

        return ResponseEntity.ok(

            timetableService.getTimetableByDate(

                date

            )

        );

    }

    // =========================================================
    // GET TIMETABLE BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<TimetableResponseDTO> getTimetableById(

        @PathVariable Long id

    ) {

        return ResponseEntity.ok(

            timetableService.getTimetableById(

                id

            )

        );

    }

    // =========================================================
    // GET TIMETABLE BY DATE
    // =========================================================

    @GetMapping("/date")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<TimetableResponseDTO>> getTimetableByDate(

        @RequestParam LocalDate date

    ) {

        return ResponseEntity.ok(

            timetableService.getTimetableByDate(

                date

            )

        );

    }

    // =========================================================
    // GET TIMETABLE BY DATE + LAB
    // =========================================================

    @GetMapping("/date/lab")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<TimetableResponseDTO>> getTimetableByDateAndLab(

        @RequestParam LocalDate date,

        @RequestParam String lab

    ) {

        return ResponseEntity.ok(

            timetableService.getTimetableByDateAndLab(

                date,

                lab

            )

        );

    }

    // =========================================================
    // REAL-TIME LAB OCCUPANCY
    // =========================================================

    @GetMapping("/occupancy")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<LabOccupancyResponseDTO>> getLabOccupancy(

        @RequestParam LocalDate date,

        @RequestParam(required = false)
        String lab

    ) {

        return ResponseEntity.ok(

            timetableService.getLabOccupancy(

                date,

                lab

            )

        );

    }

    // =========================================================
    // MANUAL OCCUPANCY STATUS
    // =========================================================

    /*
     * OCCUPIED -> VACANT
     *
     * VACANT -> SCHEDULED
     *
     * Example:
     *
     * PATCH
     * /api/timetables/15/occupancy-status?status=VACANT
     *
     * PATCH
     * /api/timetables/15/occupancy-status?status=SCHEDULED
     *
     * =========================================================
     */

    @PatchMapping("/{id}/occupancy-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TimetableResponseDTO> updateOccupancyStatus(

        @PathVariable Long id,

        @RequestParam String status

    ) {

        return ResponseEntity.ok(

            timetableService.updateOccupancyStatus(

                id,

                status

            )

        );

    }

    // =========================================================
    // UPDATE TIMETABLE
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimetableResponseDTO> updateTimetable(

        @PathVariable Long id,

        @RequestBody TimetableRequestDTO request

    ) {

        return ResponseEntity.ok(

            timetableService.updateTimetable(

                id,

                request

            )

        );

    }

    // =========================================================
    // DELETE TIMETABLE
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTimetable(

        @PathVariable Long id

    ) {

        timetableService.deleteTimetable(

            id

        );

        return ResponseEntity

            .noContent()

            .build();

    }

}