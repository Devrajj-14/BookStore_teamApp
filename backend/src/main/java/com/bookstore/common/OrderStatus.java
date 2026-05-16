package com.bookstore.common;

/**
 * Enum for Order Status with lifecycle management
 */
public enum OrderStatus {
    PENDING("Order placed, awaiting confirmation"),
    CONFIRMED("Order confirmed"),
    PROCESSING("Order being prepared"),
    SHIPPED("Order shipped to customer"),
    DELIVERED("Order delivered successfully"),
    CANCELLED("Order cancelled"),
    REFUNDED("Order refunded");
    
    private final String description;
    
    OrderStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * Check if the current status can transition to the new status
     * 
     * @param newStatus The target status
     * @return true if transition is allowed
     */
    public boolean canTransitionTo(OrderStatus newStatus) {
        return switch (this) {
            case PENDING -> newStatus == CONFIRMED || newStatus == CANCELLED;
            case CONFIRMED -> newStatus == PROCESSING || newStatus == CANCELLED;
            case PROCESSING -> newStatus == SHIPPED || newStatus == CANCELLED;
            case SHIPPED -> newStatus == DELIVERED || newStatus == CANCELLED;
            case DELIVERED -> newStatus == REFUNDED;
            case CANCELLED, REFUNDED -> false; // Terminal states
        };
    }
    
    /**
     * Check if the order can be cancelled in the current status
     * 
     * @return true if cancellable
     */
    public boolean isCancellable() {
        return this == PENDING || this == CONFIRMED || this == PROCESSING || this == SHIPPED;
    }
    
    /**
     * Check if the order is in a terminal state (cannot be changed)
     * 
     * @return true if terminal
     */
    public boolean isTerminal() {
        return this == CANCELLED || this == REFUNDED || this == DELIVERED;
    }
}
