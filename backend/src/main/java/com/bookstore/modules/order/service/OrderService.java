package com.bookstore.modules.order.service;

import com.bookstore.common.AppConstants;
import com.bookstore.common.OrderStatus;
import com.bookstore.entity.*;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.modules.customer.repository.AddressRepository;
import com.bookstore.modules.order.dto.*;
import com.bookstore.modules.order.repository.OrderItemRepository;
import com.bookstore.modules.order.repository.OrderRepository;
import com.bookstore.modules.product.repository.ProductRepository;
import com.bookstore.modules.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        AddressRepository addressRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    // --- Get current logged-in user via SecurityContext ---
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // --- Place a new order ---
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        User user = getCurrentUser();

        // Validate delivery address belongs to this user
        Address address = addressRepository.findById(request.getDeliveryAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", request.getDeliveryAddressId()));

        if (!address.getCustomerProfile().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Delivery address does not belong to current user");
        }

        // Build order items and calculate total
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", itemReq.getProductId()));

            if (product.getStockQuantity() <= AppConstants.OUT_OF_STOCK) {
                throw new BadRequestException("Product '" + product.getTitle() + "' is out of stock");
            }
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for '" + product.getTitle() + "'");
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitPrice(product.getPrice());

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }

        // Save order
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(address);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING.name());
        Order savedOrder = orderRepository.save(order);

        // Save order items linked to the order
        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        return buildOrderResponse(savedOrder);
    }

    // --- Get all orders for current user ---
    public List<OrderResponse> getMyOrders() {
        User user = getCurrentUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::buildOrderResponse)
                .collect(Collectors.toList());
    }

    // --- Get single order by ID (user can only see their own) ---
    public OrderResponse getOrderById(Long orderId) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to current user");
        }

        return buildOrderResponse(order);
    }

    // --- Admin: get all orders ---
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::buildOrderResponse)
                .collect(Collectors.toList());
    }

    // --- Admin: update order status ---
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        // Validate the status value is a known OrderStatus
        try {
            OrderStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + request.getStatus());
        }

        order.setStatus(request.getStatus().toUpperCase());
        orderRepository.save(order);

        return buildOrderResponse(order);
    }

    // --- Build OrderResponse from Order entity ---
    private OrderResponse buildOrderResponse(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        List<OrderItemResponse> itemResponses = items.stream().map(item -> {
            OrderItemResponse r = new OrderItemResponse();
            r.setProductId(item.getProduct().getId());
            r.setProductTitle(item.getProduct().getTitle());
            r.setProductAuthor(item.getProduct().getAuthor());
            r.setProductImageUrl(item.getProduct().getImageUrl());
            r.setQuantity(item.getQuantity());
            r.setUnitPrice(item.getUnitPrice());
            r.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return r;
        }).collect(Collectors.toList());

        Address addr = order.getDeliveryAddress();

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setCreatedAt(order.getCreatedAt());
        response.setDeliveryLine1(addr.getLine1());
        response.setDeliveryLine2(addr.getLine2());
        response.setDeliveryCity(addr.getCity());
        response.setDeliveryState(addr.getState());
        response.setDeliveryPincode(addr.getPincode());
        response.setItems(itemResponses);

        return response;
    }
}
