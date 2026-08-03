import { Database } from "./database";

export type Part = Database["public"]["Tables"]["parts"]["Row"];
export type PartInsert = Database["public"]["Tables"]["parts"]["Insert"];
export type PartUpdate = Database["public"]["Tables"]["parts"]["Update"];
