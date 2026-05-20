package com.bookstore.modules.user.service;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.user.dto.AuthResponse;
import com.bookstore.modules.user.dto.LoginRequest;
import com.bookstore.modules.user.dto.RegisterRequest;

public interface AuthService extends BaseService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
