package com.bookstore.modules.order.dto;

import java.math.BigDecimal;

/**
 * Response payload for a single line item within an order.
 * Nested inside OrderResponse.
 */
public class OrderItemResponse {

    private Long productId;
    private String productTitle;
    private String productAuthor;
    private String productImageUrl;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal; // unitPrice * quantity

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public String getProductAuthor() { return productAuthor; }
    public void setProductAuthor(String productAuthor) { this.productAuthor = productAuthor; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
