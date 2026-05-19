package com.bookstore.modules.cart.service;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.cart.dto.AddToCartRequest;

import com.bookstore.modules.cart.dto.CartResponse;
import com.bookstore.modules.cart.dto.UpdateCartItemRequest;

public interface CartService extends BaseService {

    CartResponse getCart();

    CartResponse addToCart(AddToCartRequest request);

    CartResponse updateCartItem(Long itemId, UpdateCartItemRequest request);

    void removeCartItem(Long itemId);

    void clearCart();
}
