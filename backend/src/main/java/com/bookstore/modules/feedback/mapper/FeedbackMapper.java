package com.bookstore.modules.feedback.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bookstore.entity.Feedback;
import com.bookstore.modules.feedback.dto.FeedbackResponse;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "userId",    source = "user.id")
    @Mapping(target = "userName",  source = "user.name")
    FeedbackResponse toFeedbackResponse(Feedback feedback);

    List<FeedbackResponse> toFeedbackResponseList(List<Feedback> feedbacks);
}
