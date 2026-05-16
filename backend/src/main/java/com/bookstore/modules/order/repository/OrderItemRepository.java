package com.bookstore.modules.order.repository;

import com.bookstore.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for OrderItem entity.
 * Provides queries to fetch line items belonging to a specific order.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Fetch all items belonging to a specific order
    List<OrderItem> findByOrderId(Long orderId);

    // Check if a user has ever ordered a specific product (used to gate feedback)
    boolean existsByOrderUserIdAndProductId(Long userId, Long productId);
}
