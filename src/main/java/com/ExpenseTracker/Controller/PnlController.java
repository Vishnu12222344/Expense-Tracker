package com.ExpenseTracker.Controller;

import com.ExpenseTracker.Service.PnlService;
import com.ExpenseTracker.dto.PnlResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pnl")
@CrossOrigin("*")
public class PnlController {
    private final PnlService service;

    public PnlController(PnlService service) {
        this.service = service;
    }

    @GetMapping
    public PnlResponse getPnlSummary() {
        // Get the email of the currently authenticated user from the JWT filter
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.calculatePnLMetrics(email);
    }
}