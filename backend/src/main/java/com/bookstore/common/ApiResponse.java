package com.bookstore.common;

/**
 * Generic API Response wrapper for consistent API responses
 * 
 * @param <T> The type of data being returned
 */
public record ApiResponse<T>(
    boolean success,
    String message,
    T data
) {
    
    /**
     * Create a success response with data
     * 
     * @param data The response data
     * @return ApiResponse with success=true
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data);
    }
    
    /**
     * Create a success response with custom message and data
     * 
     * @param message Custom success message
     * @param data The response data
     * @return ApiResponse with success=true
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
    
    /**
     * Create an error response with message
     * 
     * @param message Error message
     * @return ApiResponse with success=false and null data
     */
    public static <Void> ApiResponse<Void> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
    
    /**
     * Create a success response with only message (no data)
     * 
     * @param message Success message
     * @return ApiResponse with success=true and null data
     */
    public static <Void> ApiResponse<Void> success(String message) {
        return new ApiResponse<>(true, message, null);
    }
}
