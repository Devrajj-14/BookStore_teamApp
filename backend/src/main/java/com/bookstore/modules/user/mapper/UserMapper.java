package com.bookstore.modules.user.mapper;

import org.mapstruct.Mapper;

import com.bookstore.entity.User;
import com.bookstore.modules.user.dto.UserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(User user);
}
