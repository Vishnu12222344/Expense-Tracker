package com.ExpenseTracker.Controller;

import com.ExpenseTracker.Model.Expense;
import com.ExpenseTracker.Service.ExpenseService;
import org.springframework.data.domain.Sort;
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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.addExpense(e, email);
    }

    @GetMapping
    public List<Expense> all(
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(defaultValue = "expenseDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        if (category.equalsIgnoreCase("all")) {
            return service.getAllForUser(email, sort);
        }
        return service.getByCategoryForUser(email, category, sort);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        service.deleteExpense(id, email);
    }
}