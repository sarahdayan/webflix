import type { Affinity } from "@prisma/client";

export type AffinityMap<TData> = Record<
  string,
  { affinity: Affinity; data: TData[] }
>;
