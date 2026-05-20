package com.bookstore.modules.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response payload returned to the frontend for a single order.
 * Used on the Orders page and order detail view.
 */
public class OrderResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    // Flattened address fields — no need to expose the full Address entity
    private String deliveryLine1;
    private String deliveryLine2;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryPincode;

    // Line items inside this order
    private List<OrderItemResponse> items;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDeliveryLine1() { return deliveryLine1; }
    public void setDeliveryLine1(String deliveryLine1) { this.deliveryLine1 = deliveryLine1; }

    public String getDeliveryLine2() { return deliveryLine2; }
    public void setDeliveryLine2(String deliveryLine2) { this.deliveryLine2 = deliveryLine2; }

    public String getDeliveryCity() { return deliveryCity; }
    public void setDeliveryCity(String deliveryCity) { this.deliveryCity = deliveryCity; }

    public String getDeliveryState() { return deliveryState; }
    public void setDeliveryState(String deliveryState) { this.deliveryState = deliveryState; }

    public String getDeliveryPincode() { return deliveryPincode; }
    public void setDeliveryPincode(String deliveryPincode) { this.deliveryPincode = deliveryPincode; }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }
}
