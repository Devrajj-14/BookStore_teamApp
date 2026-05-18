package com.bookstore.modules.wishlist.dto;

import java.util.List;

public class WishlistResponse {

    private Long id;
    private Long userId;
    private List<WishlistItemResponse> items;
    private Integer totalItems;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<WishlistItemResponse> getItems() { return items; }
    public void setItems(List<WishlistItemResponse> items) { this.items = items; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }
}
