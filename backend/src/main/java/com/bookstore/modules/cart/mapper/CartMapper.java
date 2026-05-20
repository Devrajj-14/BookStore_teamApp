package com.bookstore.modules.cart.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.modules.cart.dto.CartItemResponse;
import com.bookstore.modules.cart.dto.CartResponse;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "productId",       source = "product.id")
    @Mapping(target = "productTitle",    source = "product.title")
    @Mapping(target = "productImage",    source = "product.imageUrl")
    @Mapping(target = "subtotal",
             expression = "java(item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))")
    CartItemResponse toCartItemResponse(CartItem item);

    List<CartItemResponse> toCartItemResponseList(List<CartItem> items);

    @Mapping(target = "userId",      source = "user.id")
    @Mapping(target = "items",       ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    CartResponse toCartResponse(Cart cart);
}
