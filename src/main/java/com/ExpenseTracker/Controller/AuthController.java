package com.ExpenseTracker.Controller;

import com.ExpenseTracker.Service.AuthService;
import com.ExpenseTracker.dto.AuthResponse;
import com.ExpenseTracker.dto.LoginRequest;
import com.ExpenseTracker.dto.SignupRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request) {
        return service.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }
}
