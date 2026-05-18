package com.bookstore.modules.feedback.service;

import com.bookstore.entity.Feedback;
import com.bookstore.entity.Product;
import com.bookstore.entity.User;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.modules.feedback.dto.FeedbackRequest;
import com.bookstore.modules.feedback.dto.FeedbackResponse;
import com.bookstore.modules.feedback.dto.RatingSummary;
import com.bookstore.modules.feedback.repository.FeedbackRepository;
import com.bookstore.modules.order.repository.OrderItemRepository;
import com.bookstore.modules.product.repository.ProductRepository;
import com.bookstore.modules.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           OrderItemRepository orderItemRepository) {
        this.feedbackRepository = feedbackRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // --- Get current logged-in user via SecurityContext ---
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // --- Submit a new review ---
    @Transactional
    public FeedbackResponse submitFeedback(FeedbackRequest request) {
        User user = getCurrentUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        // Only allow review if user has purchased the product
        if (!orderItemRepository.existsByOrderUserIdAndProductId(user.getId(), product.getId())) {
            throw new BadRequestException("You can only review products you have purchased");
        }

        // Prevent duplicate reviews
        if (feedbackRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setProduct(product);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());

        Feedback saved = feedbackRepository.save(feedback);
        return buildFeedbackResponse(saved);
    }

    // --- Update an existing review ---
    @Transactional
    public FeedbackResponse updateFeedback(Long feedbackId, FeedbackRequest request) {
        User user = getCurrentUser();

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", feedbackId));

        if (!feedback.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only edit your own reviews");
        }

        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());

        Feedback saved = feedbackRepository.save(feedback);
        return buildFeedbackResponse(saved);
    }

    // --- Delete a review ---
    @Transactional
    public void deleteFeedback(Long feedbackId) {
        User user = getCurrentUser();

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", feedbackId));

        if (!feedback.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only delete your own reviews");
        }

        feedbackRepository.delete(feedback);
    }

    // --- Get all reviews for a product ---
    public List<FeedbackResponse> getProductFeedback(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", productId);
        }
        return feedbackRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::buildFeedbackResponse)
                .collect(Collectors.toList());
    }

    // --- Get rating summary for a product ---
    public RatingSummary getRatingSummary(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", productId);
        }

        Double avg = feedbackRepository.findAverageRatingByProductId(productId);
        long total = feedbackRepository.countByProductId(productId);

        List<Feedback> all = feedbackRepository.findByProductIdOrderByCreatedAtDesc(productId);
        long one   = all.stream().filter(f -> f.getRating() == 1).count();
        long two   = all.stream().filter(f -> f.getRating() == 2).count();
        long three = all.stream().filter(f -> f.getRating() == 3).count();
        long four  = all.stream().filter(f -> f.getRating() == 4).count();
        long five  = all.stream().filter(f -> f.getRating() == 5).count();

        return new RatingSummary(productId, avg, total, one, two, three, four, five);
    }

    // --- Get all reviews by current user ---
    public List<FeedbackResponse> getMyFeedback() {
        User user = getCurrentUser();
        return feedbackRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::buildFeedbackResponse)
                .collect(Collectors.toList());
    }

    // --- Build FeedbackResponse from Feedback entity ---
    private FeedbackResponse buildFeedbackResponse(Feedback feedback) {
        FeedbackResponse response = new FeedbackResponse();
        response.setId(feedback.getId());
        response.setProductId(feedback.getProduct().getId());
        response.setUserId(feedback.getUser().getId());
        response.setUserName(feedback.getUser().getName());
        response.setRating(feedback.getRating());
        response.setComment(feedback.getComment());
        response.setCreatedAt(feedback.getCreatedAt());
        return response;
    }
}
