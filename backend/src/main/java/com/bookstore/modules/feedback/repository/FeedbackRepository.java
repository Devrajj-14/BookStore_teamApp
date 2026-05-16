package com.bookstore.modules.feedback.repository;

import com.bookstore.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Feedback entity.
 * Provides queries needed by FeedbackService for reviews and rating summaries.
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Fetch all reviews for a specific product, newest first
    List<Feedback> findByProductIdOrderByCreatedAtDesc(Long productId);

    // Fetch all reviews submitted by a specific user
    List<Feedback> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Check if a user has already reviewed a specific product
    // (enforces the unique constraint at the service level too)
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    // Find a specific user's review for a product (for update/delete)
    Optional<Feedback> findByUserIdAndProductId(Long userId, Long productId);

    // Calculate average rating for a product
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    // Count total reviews for a product
    long countByProductId(Long productId);
}
