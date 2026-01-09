import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useExpenses, useCreateExpense, useDeleteExpense } from "@/hooks/useExpenses";
import { ExpenseCategory } from "@/lib/api";
import { Trash2, Plus, TrendingDown, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const EXPENSE_CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: "PERSONAL", label: "Personal" },
  { value: "SURVIVAL", label: "Survival" },
  { value: "INVESTMENT", label: "Investment" },
];

const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  PERSONAL: "Personal",
  SURVIVAL: "Survival",
  INVESTMENT: "Investment",
};

const CATEGORY_COLORS: Record<string, string> = {
  PERSONAL: "bg-chart-1/10 text-chart-1",
  SURVIVAL: "bg-chart-2/10 text-chart-2",
  INVESTMENT: "bg-chart-3/10 text-chart-3",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function Expenses() {
  const { data: expenses, isLoading } = useExpenses();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory | "">("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    await createExpense.mutateAsync({
      description,
      amount: parseFloat(amount),
      category: category as ExpenseCategory,
      expenseDate,
    });

    setDescription("");
    setAmount("");
    setCategory("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
  };

  const filteredExpenses = expenses?.filter((exp) => 
    filterCategory === "all" || exp.category === filterCategory
  ) || [];

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track your spending</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Add Expense Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Groceries"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(val) => setCategory(val as ExpenseCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createExpense.isPending}>
                  {createExpense.isPending ? "Adding..." : "Add Expense"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Expenses List */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Expense History
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredExpenses.length > 0 ? (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExpenses.map((exp) => (
                          <TableRow key={exp.id}>
                            <TableCell className="font-medium">{exp.description}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${CATEGORY_COLORS[exp.category] || "bg-muted text-muted-foreground"}`}>
                                {EXPENSE_CATEGORY_LABELS[exp.category]}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(exp.expenseDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right font-semibold text-destructive">
                              -{formatCurrency(exp.amount)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteExpense.mutate(exp.id)}
                                disabled={deleteExpense.isPending}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="text-sm text-muted-foreground">
                      Total: <span className="font-semibold text-destructive">{formatCurrency(totalFiltered)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No expense entries yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
