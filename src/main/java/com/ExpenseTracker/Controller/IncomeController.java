package com.ExpenseTracker.Controller;

import com.ExpenseTracker.Model.Income;
import com.ExpenseTracker.Service.IncomeService;
import org.springframework.data.domain.Sort;
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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.addIncome(i, email);
    }

    @GetMapping
    public List<Income> getAll(
            @RequestParam(required = false, defaultValue = "all") String source,
            @RequestParam(defaultValue = "incomeDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Create the Sort object required by IncomeService
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        if (source.equalsIgnoreCase("all")) {
            return service.getAllForUser(email, sort);
        }
        return service.getBySourceForUser(email, source, sort);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        service.deleteIncome(id, email);
    }
}