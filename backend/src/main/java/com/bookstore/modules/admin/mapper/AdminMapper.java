package com.bookstore.modules.admin.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bookstore.entity.User;
import com.bookstore.modules.admin.dto.UserListResponse;

@Mapper(componentModel = "spring")
public interface AdminMapper {

    @Mapping(target = "totalOrders", ignore = true)
    UserListResponse toUserListResponse(User user);
}
