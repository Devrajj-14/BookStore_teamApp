package com.bookstore.modules.wishlist.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WishlistItemResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private String productAuthor;
    private String productImage;
    private BigDecimal productPrice;
    private Boolean inStock;
}
