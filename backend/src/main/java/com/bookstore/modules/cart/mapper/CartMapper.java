package com.bookstore.modules.cart.mapper;

import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.modules.cart.dto.CartItemResponse;
import com.bookstore.modules.cart.dto.CartResponse;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    // CartItem → CartItemResponse
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.title", target = "productTitle")
    @Mapping(source = "product.imageUrl", target = "productImage")
    @Mapping(target = "subtotal", ignore = true) // computed in @AfterMapping
    CartItemResponse toCartItemResponse(CartItem cartItem);

    // Compute subtotal after mapping (unitPrice × quantity)
    @AfterMapping
    default void computeSubtotal(CartItem cartItem, @MappingTarget CartItemResponse response) {
        if (cartItem.getUnitPrice() != null && cartItem.getQuantity() != null) {
            response.setSubtotal(
                cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );
        }
    }

    List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItems);

    // Cart → CartResponse
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "items", target = "items")
    @Mapping(target = "totalAmount", ignore = true) // computed in @AfterMapping
    CartResponse toCartResponse(Cart cart, List<CartItem> items);

    // Compute totalAmount after mapping
    @AfterMapping
    default void computeTotal(Cart cart, List<CartItem> items, @MappingTarget CartResponse response) {
        BigDecimal total = items.stream()
                .filter(i -> i.getUnitPrice() != null && i.getQuantity() != null)
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setTotalAmount(total);
    }
}
