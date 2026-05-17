package com.bookstore.modules.wishlist.dto;

import lombok.Data;

import java.util.List;

@Data
public class WishlistResponse {

    private Long id;
    private Long userId;
    private List<WishlistItemResponse> items;
    private Integer totalItems;
}
