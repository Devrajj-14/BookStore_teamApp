package com.bookstore.modules.admin.service;

import com.bookstore.entity.Order;
import com.bookstore.entity.User;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.modules.admin.dto.DashboardResponse;
import com.bookstore.modules.admin.dto.UserListResponse;
import com.bookstore.modules.order.repository.OrderRepository;
import com.bookstore.modules.product.repository.ProductRepository;
import com.bookstore.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminService(UserRepository userRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    // Get dashboard statistics
    public DashboardResponse getDashboardStats() {
        DashboardResponse dashboard = new DashboardResponse();

        // Counts
        dashboard.setTotalUsers(userRepository.count());
        dashboard.setTotalProducts(productRepository.count());

        List<Order> allOrders = orderRepository.findAll();
        dashboard.setTotalOrders((long) allOrders.size());

        // Revenue from DELIVERED orders
        BigDecimal revenue = allOrders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()))
                .map(o -> o.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.setTotalRevenue(revenue);

        // Pending orders count
        long pending = allOrders.stream()
                .filter(o -> "PENDING".equals(o.getStatus()))
                .count();
        dashboard.setPendingOrders(pending);

        // Low stock products (stock < 10)
        long lowStock = productRepository.findByStockQuantityLessThan(10).size();
        dashboard.setLowStockProducts(lowStock);

        // Orders grouped by status
        Map<String, Long> byStatus = new HashMap<>();
        allOrders.forEach(o -> byStatus.merge(o.getStatus(), 1L, Long::sum));
        dashboard.setOrdersByStatus(byStatus);

        return dashboard;
    }

    // Get all users
    public List<UserListResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserListResponse)
                .collect(Collectors.toList());
    }

    // Get user by ID
    public UserListResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return mapToUserListResponse(user);
    }

    // Map User entity to UserListResponse
    private UserListResponse mapToUserListResponse(User user) {
        UserListResponse response = new UserListResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        // Count orders for this user
        int orderCount = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();
        response.setTotalOrders(orderCount);

        return response;
    }
}
