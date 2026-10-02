package com.prangyajeet.labtrack.sop.exception;

public class SopException extends RuntimeException {

    public SopException(String message) {
        super(message);
    }

    public SopException(
            String message,
            Throwable cause
    ) {
        super(message, cause);
    }
}