import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateSupplier } from "@/hooks/use-suppliers";
import { useQueryClient } from "@tanstack/react-query";

interface SupplierFormProps {
  onSaved?: () => void;
}

export function SupplierForm({ onSaved }: SupplierFormProps) {
  const form = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: "", contactName: "", email: "", phone: "", whatsapp: "", country: "", city: "", address: "", notes: "" },
  });

  const createSupplier = useCreateSupplier();
  const queryClient = useQueryClient();

  const onSubmit = async (values: any) => {
    await createSupplier.mutateAsync(values);
    queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    onSaved?.();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg mb-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Supplier Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="contactName" render={({ field }) => (
          <FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="whatsapp" render={({ field }) => (
            <FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="country" render={({ field }) => (
            <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="address" render={({ field }) => (
          <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem><FormLabel>Notes</FormLabel><FormControl><textarea className="w-full p-2 border rounded" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={createSupplier.isPending}>
          {createSupplier.isPending ? "Saving..." : "Save Supplier"}
        </Button>
      </form>
    </Form>
  );
}
