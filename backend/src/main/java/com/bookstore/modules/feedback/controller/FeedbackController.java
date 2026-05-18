package com.bookstore.modules.feedback.controller;

import com.bookstore.common.ApiResponse;
import com.bookstore.modules.feedback.dto.FeedbackRequest;
import com.bookstore.modules.feedback.dto.FeedbackResponse;
import com.bookstore.modules.feedback.dto.RatingSummary;
import com.bookstore.modules.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // POST /api/feedback — submit a new review (user only)
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<FeedbackResponse>> submitFeedback(
            @Valid @RequestBody FeedbackRequest request) {
        FeedbackResponse feedback = feedbackService.submitFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", feedback));
    }

    // PUT /api/feedback/{id} — update own review (user only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackRequest request) {
        FeedbackResponse feedback = feedbackService.updateFeedback(id, request);
        return ResponseEntity.ok(ApiResponse.success("Review updated successfully", feedback));
    }

    // DELETE /api/feedback/{id} — delete own review (user only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/feedback/product/{productId} — get all reviews for a product (public)
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getProductFeedback(
            @PathVariable Long productId) {
        List<FeedbackResponse> feedback = feedbackService.getProductFeedback(productId);
        return ResponseEntity.ok(ApiResponse.success(feedback));
    }

    // GET /api/feedback/product/{productId}/summary — get rating summary (public)
    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<ApiResponse<RatingSummary>> getRatingSummary(
            @PathVariable Long productId) {
        RatingSummary summary = feedbackService.getRatingSummary(productId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    // GET /api/feedback/my — get current user's reviews
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getMyFeedback() {
        List<FeedbackResponse> feedback = feedbackService.getMyFeedback();
        return ResponseEntity.ok(ApiResponse.success(feedback));
    }
}
