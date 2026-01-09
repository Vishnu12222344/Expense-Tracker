import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { incomeApi, IncomeRequest } from "@/lib/api";
import { toast } from "sonner";

export function useIncome() {
  return useQuery({
    queryKey: ["income"],
    queryFn: incomeApi.getAll,
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IncomeRequest) => incomeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      queryClient.invalidateQueries({ queryKey: ["pnl"] });
      toast.success("Income added successfully!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add income");
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => incomeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      queryClient.invalidateQueries({ queryKey: ["pnl"] });
      toast.success("Income deleted successfully!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete income");
    },
  });
}
