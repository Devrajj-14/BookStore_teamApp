package com.bookstore.modules.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookstore.common.ApiResponse;
import com.bookstore.modules.admin.dto.DashboardResponse;
import com.bookstore.modules.admin.dto.UserListResponse;
import com.bookstore.modules.admin.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // GET /api/admin/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", stats));
    }

    // GET /api/admin/users
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserListResponse>>> getAllUsers() {
        List<UserListResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    // GET /api/admin/users/{id}
    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserListResponse>> getUserById(@PathVariable Long id) {
        UserListResponse user = adminService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
