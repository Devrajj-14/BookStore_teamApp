package com.bookstore.modules.wishlist.mapper;

import com.bookstore.entity.Wishlist;
import com.bookstore.entity.WishlistItem;
import com.bookstore.modules.wishlist.dto.WishlistItemResponse;
import com.bookstore.modules.wishlist.dto.WishlistResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class WishlistMapper {

    public WishlistItemResponse toWishlistItemResponse(WishlistItem item) {
        WishlistItemResponse r = new WishlistItemResponse();
        r.setId(item.getId());
        r.setProductId(item.getProduct().getId());
        r.setProductTitle(item.getProduct().getTitle());
        r.setProductAuthor(item.getProduct().getAuthor());
        r.setProductImage(item.getProduct().getImageUrl());
        r.setProductPrice(item.getProduct().getPrice());
        r.setInStock(item.getProduct().getStockQuantity() > 0);
        return r;
    }

    public List<WishlistItemResponse> toWishlistItemResponseList(List<WishlistItem> items) {
        return items.stream()
                .map(this::toWishlistItemResponse)
                .collect(Collectors.toList());
    }

    public WishlistResponse toWishlistResponse(Wishlist wishlist) {
        WishlistResponse r = new WishlistResponse();
        r.setId(wishlist.getId());
        r.setUserId(wishlist.getUser().getId());
        return r;
    }
}
