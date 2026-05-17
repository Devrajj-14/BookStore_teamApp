package com.bookstore.common;

/**
 * Application-wide constants
 */
public class AppConstants {
    
    // JWT Configuration
    public static final String JWT_SECRET = "bookstore-secret-key-change-this-in-production-with-env-variable";
    public static final long JWT_EXPIRATION_MS = 86400000L; // 24 hours
    public static final String JWT_HEADER = "Authorization";
    public static final String JWT_PREFIX = "Bearer ";
    
    // Pagination Defaults
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIRECTION = "ASC";
    
    // Stock Thresholds
    public static final int LOW_STOCK_THRESHOLD = 10;
    public static final int OUT_OF_STOCK = 0;
    
    // API Response Messages
    public static final String SUCCESS = "Operation completed successfully";
    public static final String CREATED = "Resource created successfully";
    public static final String UPDATED = "Resource updated successfully";
    public static final String DELETED = "Resource deleted successfully";
    public static final String NOT_FOUND = "Resource not found";
    public static final String BAD_REQUEST = "Invalid request";
    public static final String UNAUTHORIZED = "Unauthorized access";
    
    // Validation Messages
    public static final String INVALID_EMAIL = "Invalid email format";
    public static final String INVALID_PASSWORD = "Password must be at least 6 characters";
    public static final String EMAIL_EXISTS = "Email already exists";
    public static final String PRODUCT_OUT_OF_STOCK = "Product is out of stock";
    public static final String INSUFFICIENT_STOCK = "Insufficient stock available";
    
    private AppConstants() {
        // Private constructor to prevent instantiation
    }
}
