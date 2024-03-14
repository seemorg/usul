import { z } from "zod";

export const viewSchema = z
  .enum(["grid", "list"])
  .default("list")
  .catch("list");

export type View = z.infer<typeof viewSchema>;
