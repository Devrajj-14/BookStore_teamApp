package com.bookstore.modules.order.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for updating the status of an existing order.
 * Used by the admin to move an order through its lifecycle
 * (e.g. PENDING → CONFIRMED → SHIPPED → DELIVERED).
 */
public class OrderStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
