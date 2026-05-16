package com.bookstore.modules.order.repository;

import com.bookstore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Order entity.
 * Provides queries needed by OrderService for user order history and admin management.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Fetch all orders placed by a specific user, newest first
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Fetch orders filtered by status (for admin dashboard)
    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    // Check if a user has any delivered order containing a specific product
    // (used later to gate feedback submission)
    boolean existsByUserIdAndStatus(Long userId, String status);
}
