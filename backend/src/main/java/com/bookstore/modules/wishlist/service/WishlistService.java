package com.bookstore.modules.wishlist.service;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.wishlist.dto.WishlistResponse;

public interface WishlistService extends BaseService {

    WishlistResponse getWishlist();

    WishlistResponse addToWishlist(Long productId);

    void removeFromWishlist(Long productId);

    boolean isInWishlist(Long productId);
}
