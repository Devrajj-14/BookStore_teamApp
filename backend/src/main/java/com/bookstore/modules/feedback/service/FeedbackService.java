package com.bookstore.modules.feedback.service;

import java.util.List;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.feedback.dto.FeedbackRequest;
import com.bookstore.modules.feedback.dto.FeedbackResponse;
import com.bookstore.modules.feedback.dto.RatingSummary;

public interface FeedbackService extends BaseService {

    FeedbackResponse submitFeedback(FeedbackRequest request);

    FeedbackResponse updateFeedback(Long feedbackId, FeedbackRequest request);

    void deleteFeedback(Long feedbackId);

    List<FeedbackResponse> getProductFeedback(Long productId);

    RatingSummary getRatingSummary(Long productId);

    List<FeedbackResponse> getMyFeedback();
}
