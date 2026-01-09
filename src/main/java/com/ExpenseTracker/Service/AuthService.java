package com.ExpenseTracker.Service;
import com.ExpenseTracker.Model.User;
import com.ExpenseTracker.Repository.UserRepository;
import com.ExpenseTracker.Security.JwtUtil;
import com.ExpenseTracker.dto.AuthResponse;
import com.ExpenseTracker.dto.LoginRequest;
import com.ExpenseTracker.dto.SignupRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository repo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse signup(SignupRequest request) {
        User user = new User();
        user.setEmail(request.email());
        user.setPassword(encoder.encode(request.password()));
        repo.save(user);
        return new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = repo.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!encoder.matches(request.password(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        return new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getEmail());
    }
}