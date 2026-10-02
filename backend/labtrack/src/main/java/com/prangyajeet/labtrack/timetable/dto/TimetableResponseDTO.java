package com.prangyajeet.labtrack.timetable.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class TimetableResponseDTO {

    private Long id;

    private LocalDate date;

    private String day;

    private LocalTime timeFrom;

    private LocalTime timeTo;

    private String faculty;

    private String lab;

    private String subject;

    private String className;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public TimetableResponseDTO() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }


    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }


    public LocalTime getTimeFrom() {
        return timeFrom;
    }

    public void setTimeFrom(
        LocalTime timeFrom
    ) {
        this.timeFrom = timeFrom;
    }


    public LocalTime getTimeTo() {
        return timeTo;
    }

    public void setTimeTo(
        LocalTime timeTo
    ) {
        this.timeTo = timeTo;
    }


    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(
        String faculty
    ) {
        this.faculty = faculty;
    }


    public String getLab() {
        return lab;
    }

    public void setLab(
        String lab
    ) {
        this.lab = lab;
    }


    public String getSubject() {
        return subject;
    }

    public void setSubject(
        String subject
    ) {
        this.subject = subject;
    }


    public String getClassName() {
        return className;
    }

    public void setClassName(
        String className
    ) {
        this.className = className;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(
        String status
    ) {
        this.status = status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
        LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
        LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }
}