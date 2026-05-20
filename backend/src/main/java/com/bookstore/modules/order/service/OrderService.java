package com.bookstore.modules.order.service;

import java.util.List;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.order.dto.OrderRequest;
import com.bookstore.modules.order.dto.OrderResponse;
import com.bookstore.modules.order.dto.OrderStatusUpdateRequest;

public interface OrderService extends BaseService {

    OrderResponse placeOrder(OrderRequest request);

    List<OrderResponse> getMyOrders();

    OrderResponse getOrderById(Long orderId);

    List<OrderResponse> getAllOrders();

    OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request);
}
