package com.bookstore.modules.admin.controller;

import com.bookstore.common.ApiResponse;
import com.bookstore.modules.admin.dto.DashboardResponse;
import com.bookstore.modules.admin.dto.UserListResponse;
import com.bookstore.modules.admin.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// NOTE: @PreAuthorize("hasRole('ADMIN')") will be added once Rajveer's auth is merged
@RestController
@RequestMapping("/api/admin")
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
