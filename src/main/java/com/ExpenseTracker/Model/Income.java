package com.ExpenseTracker.Model;

import com.ExpenseTracker.Model.Enums.IncomeSource;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter @Setter
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Enumerated(EnumType.STRING)
    private IncomeSource source;

    private Double amount;

    private LocalDate incomeDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
