package com.bookstore.modules.order.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bookstore.entity.Order;
import com.bookstore.entity.OrderItem;
import com.bookstore.modules.order.dto.OrderItemResponse;
import com.bookstore.modules.order.dto.OrderResponse;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "productId",       source = "product.id")
    @Mapping(target = "productTitle",    source = "product.title")
    @Mapping(target = "productAuthor",   source = "product.author")
    @Mapping(target = "productImageUrl", source = "product.imageUrl")
    @Mapping(target = "subtotal",
             expression = "java(item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))")
    OrderItemResponse toOrderItemResponse(OrderItem item);

    List<OrderItemResponse> toOrderItemResponseList(List<OrderItem> items);

    @Mapping(target = "userId",          source = "user.id")
    @Mapping(target = "userName",        source = "user.name")
    @Mapping(target = "deliveryLine1",   source = "deliveryAddress.line1")
    @Mapping(target = "deliveryLine2",   source = "deliveryAddress.line2")
    @Mapping(target = "deliveryCity",    source = "deliveryAddress.city")
    @Mapping(target = "deliveryState",   source = "deliveryAddress.state")
    @Mapping(target = "deliveryPincode", source = "deliveryAddress.pincode")
    @Mapping(target = "items",           ignore = true)
    OrderResponse toOrderResponse(Order order);
}
