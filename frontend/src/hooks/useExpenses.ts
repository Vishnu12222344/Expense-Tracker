import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseApi, ExpenseRequest } from "@/lib/api";
import { toast } from "sonner";

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: expenseApi.getAll,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExpenseRequest) => expenseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["pnl"] });
      toast.success("Expense added successfully!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add expense");
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => expenseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["pnl"] });
      toast.success("Expense deleted successfully!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete expense");
    },
  });
}
