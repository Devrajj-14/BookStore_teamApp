package com.bookstore.modules.user.service;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.user.dto.UserResponse;

public interface UserService extends BaseService {

    UserResponse getMyProfile(String email);

    UserResponse updateProfile(String email, String newName);
}
