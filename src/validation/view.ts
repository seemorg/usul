import { z } from "zod";

export const viewSchema = z
  .enum(["grid", "list"])
  .default("grid")
  .catch("grid");

export type View = z.infer<typeof viewSchema>;
