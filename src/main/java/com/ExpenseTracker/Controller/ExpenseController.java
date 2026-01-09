package com.ExpenseTracker.Controller;

import com.ExpenseTracker.Model.Expense;
import com.ExpenseTracker.Service.ExpenseService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @PostMapping
    public Expense add(@RequestBody Expense e) {
        // Get the logged-in user's email from the security token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.addExpense(e, email);
    }

    @GetMapping
    public List<Expense> all() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getAllForUser(email);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        // Get the email of the logged-in user from the SecurityContext
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        service.deleteExpense(id, email);
    }
}

