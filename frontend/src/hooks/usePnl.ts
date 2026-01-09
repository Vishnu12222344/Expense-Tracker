import { useQuery } from "@tanstack/react-query";
import { pnlApi } from "@/lib/api";

export function usePnl() {
  return useQuery({
    queryKey: ["pnl"],
    queryFn: pnlApi.get,
  });
}
