package com.bookstore.modules.admin.service;

import java.util.List;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.admin.dto.DashboardResponse;
import com.bookstore.modules.admin.dto.UserListResponse;

public interface AdminService extends BaseService {

    DashboardResponse getDashboardStats();

    List<UserListResponse> getAllUsers();

    UserListResponse getUserById(Long id);
}
