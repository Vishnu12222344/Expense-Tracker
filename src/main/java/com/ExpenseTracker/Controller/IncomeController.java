package com.ExpenseTracker.Controller;

import com.ExpenseTracker.Model.Income;
import com.ExpenseTracker.Service.IncomeService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/income")
@CrossOrigin("*")
public class IncomeController {

    private final IncomeService service;

    public IncomeController(IncomeService service) {
        this.service = service;
    }

    @PostMapping
    public Income add(@RequestBody Income i) {
        // Identifies the user from their JWT token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.addIncome(i, email);
    }

    @GetMapping
    public List<Income> all() {
        // Identifies the user from their JWT token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getAllForUser(email);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        service.deleteIncome(id, email);
    }
}