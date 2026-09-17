import { useQuery } from "@tanstack/react-query";
import { getOcupacion } from "../api/ocupacion.api";
import type { Ocupacion } from "../types";

const POLLING_INTERVAL = 8000;

export function useOcupacion(zonaId?: string) {
  return useQuery<Ocupacion>({
    queryKey: ["ocupacion", zonaId ?? "all"],
    queryFn: () => getOcupacion(zonaId),
    refetchInterval: POLLING_INTERVAL,
    staleTime: POLLING_INTERVAL,
  });
}
