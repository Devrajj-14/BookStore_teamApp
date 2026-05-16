package com.bookstore.exception;

/**
 * Exception thrown for invalid client requests
 * Returns HTTP 400 status
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
    
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
