package com.bookstore.modules.cart.mapper;

import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.modules.cart.dto.CartItemResponse;
import com.bookstore.modules.cart.dto.CartResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartItemResponse toCartItemResponse(CartItem item) {
        CartItemResponse r = new CartItemResponse();
        r.setId(item.getId());
        r.setProductId(item.getProduct().getId());
        r.setProductTitle(item.getProduct().getTitle());
        r.setProductImage(item.getProduct().getImageUrl());
        r.setUnitPrice(item.getUnitPrice());
        r.setQuantity(item.getQuantity());
        if (item.getUnitPrice() != null && item.getQuantity() != null) {
            r.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return r;
    }

    public List<CartItemResponse> toCartItemResponseList(List<CartItem> items) {
        return items.stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());
    }

    public CartResponse toCartResponse(Cart cart) {
        CartResponse r = new CartResponse();
        r.setId(cart.getId());
        r.setUserId(cart.getUser().getId());
        return r;
    }
}
