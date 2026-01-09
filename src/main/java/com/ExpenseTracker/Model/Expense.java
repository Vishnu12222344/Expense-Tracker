package com.ExpenseTracker.Model;

import com.ExpenseTracker.Model.Enums.ExpenseCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter @Setter
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Enumerated(EnumType.STRING)
    private ExpenseCategory category;

    private Double amount;

    private LocalDate expenseDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
