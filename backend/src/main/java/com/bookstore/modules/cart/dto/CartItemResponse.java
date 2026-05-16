package com.bookstore.modules.cart.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private String productImage;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
}
