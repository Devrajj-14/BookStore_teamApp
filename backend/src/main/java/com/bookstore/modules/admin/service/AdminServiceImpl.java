package com.bookstore.modules.admin.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookstore.entity.Order;
import com.bookstore.entity.User;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.modules.admin.dto.DashboardResponse;
import com.bookstore.modules.admin.dto.UserListResponse;
import com.bookstore.modules.admin.mapper.AdminMapper;
import com.bookstore.modules.order.repository.OrderRepository;
import com.bookstore.modules.product.repository.ProductRepository;
import com.bookstore.modules.user.repository.UserRepository;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AdminMapper adminMapper;

    public AdminServiceImpl(UserRepository userRepository,
                            ProductRepository productRepository,
                            OrderRepository orderRepository,
                            AdminMapper adminMapper) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.adminMapper = adminMapper;
    }

    // Get dashboard statistics
    @Override
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
                .map(Order::getTotalAmount)
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
    @Override
    public List<UserListResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserListResponse)
                .collect(Collectors.toList());
    }

    // Get user by ID
    @Override
    public UserListResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return mapToUserListResponse(user);
    }

    // Map User entity to UserListResponse via AdminMapper, then set totalOrders manually
    private UserListResponse mapToUserListResponse(User user) {
        UserListResponse response = adminMapper.toUserListResponse(user);
        int orderCount = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();
        response.setTotalOrders(orderCount);
        return response;
    }
}
