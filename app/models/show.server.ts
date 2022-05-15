import type { Show } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Show } from "@prisma/client";

export async function getShowById(id: Show["id"]) {
  return prisma.show.findUnique({ where: { id } });
}
