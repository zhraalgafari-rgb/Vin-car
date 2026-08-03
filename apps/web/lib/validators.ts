import { z } from "zod";

export const vinSchema = z.object({
  vin: z.string().length(17, "VIN must be 17 characters").regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format"),
});

export const partSchema = z.object({
  arabicName: z.string().optional(),
  englishName: z.string().min(1, "English name is required"),
  partCategory: z.string().optional(),
  oemNumber: z.string().optional(),
  alternativeOemNumbers: z.array(z.string()).optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
  weight: z.object({
    value: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
  compatibleVehicles: z.array(z.string()).optional(),
  brands: z.array(z.string()).optional(),
  notes: z.string().optional(),
  quantity: z.number().int().min(0).optional(),
  status: z.enum(["in_stock", "out_of_stock", "ordered", "discontinued"]).optional(),
});

export const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contactName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  customerType: z.enum(["wholesaler", "dealer", "retail", "other"]).optional(),
  notes: z.string().optional(),
});

export type VINFormData = z.infer<typeof vinSchema>;
export type PartFormData = z.infer<typeof partSchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
