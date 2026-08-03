import { Database } from "./database";

export type VinRecord = Database["public"]["Tables"]["vin_records"]["Row"];
export type VinInsert = Database["public"]["Tables"]["vin_records"]["Insert"];
export type VinUpdate = Database["public"]["Tables"]["vin_records"]["Update"];
