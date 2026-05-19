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

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.title", target = "productTitle")
    @Mapping(source = "product.imageUrl", target = "productImage")
    @Mapping(target = "subtotal", ignore = true)
    CartItemResponse toCartItemResponse(CartItem cartItem);

    @AfterMapping
    default void computeSubtotal(CartItem cartItem, @MappingTarget CartItemResponse response) {
        if (cartItem.getUnitPrice() != null && cartItem.getQuantity() != null) {
            response.setSubtotal(
                cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );
        }
    }

    List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItems);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    CartResponse toCartResponse(Cart cart);
}
