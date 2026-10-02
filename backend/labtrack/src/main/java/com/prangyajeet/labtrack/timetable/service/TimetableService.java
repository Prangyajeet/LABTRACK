package com.prangyajeet.labtrack.timetable.service;

import com.prangyajeet.labtrack.timetable.dto.LabOccupancyResponseDTO;
import com.prangyajeet.labtrack.timetable.dto.TimetableRequestDTO;
import com.prangyajeet.labtrack.timetable.dto.TimetableResponseDTO;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface TimetableService {

    TimetableResponseDTO createTimetable(
        TimetableRequestDTO request
    );

    TimetableResponseDTO updateTimetable(
        Long id,
        TimetableRequestDTO request
    );

    void deleteTimetable(
        Long id
    );

    TimetableResponseDTO getTimetableById(
        Long id
    );

    List<TimetableResponseDTO> getAllTimetables();

    List<TimetableResponseDTO> getTimetableByDate(
        LocalDate date
    );

    List<TimetableResponseDTO> getTimetableByDateAndLab(
        LocalDate date,
        String lab
    );

    List<LabOccupancyResponseDTO> getLabOccupancy(
        LocalDate date,
        String lab
    );

    List<TimetableResponseDTO> uploadTimetable(
        MultipartFile file
    );

    /*
     * Manually override the live occupancy status.
     *
     * VACANT   -> manually make active lab vacant
     * SCHEDULED -> restore automatic occupancy calculation
     */
    TimetableResponseDTO updateOccupancyStatus(
        Long id,
        String status
    );
}