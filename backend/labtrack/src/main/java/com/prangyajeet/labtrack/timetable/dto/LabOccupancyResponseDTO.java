package com.prangyajeet.labtrack.timetable.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class LabOccupancyResponseDTO {

    private LocalDate date;

    private String day;

    private LocalTime timeFrom;

    private LocalTime timeTo;

    private String lab;

    private String faculty;

    private String subject;

    private String className;

    private String status;


    public LabOccupancyResponseDTO() {
    }


    public LocalDate getDate() {
        return date;
    }

    public void setDate(
        LocalDate date
    ) {
        this.date = date;
    }


    public String getDay() {
        return day;
    }

    public void setDay(
        String day
    ) {
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


    public String getLab() {
        return lab;
    }

    public void setLab(
        String lab
    ) {
        this.lab = lab;
    }


    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(
        String faculty
    ) {
        this.faculty = faculty;
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
}