import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateCustomer } from "@/hooks/use-customers";
import { useQueryClient } from "@tanstack/react-query";

interface CustomerFormProps {
  onSaved?: () => void;
}

export function CustomerForm({ onSaved }: CustomerFormProps) {
  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", whatsapp: "", country: "", customerType: "wholesaler", notes: "" },
  });

  const createCustomer = useCreateCustomer();
  const queryClient = useQueryClient();

  const onSubmit = async (values: any) => {
    await createCustomer.mutateAsync(values);
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    onSaved?.();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg mb-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
        <FormField control={form.control} name="customerType" render={({ field }) => (
          <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="wholesaler">Wholesaler</SelectItem><SelectItem value="dealer">Dealer</SelectItem><SelectItem value="retail">Retail</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></FormItem>
        )} />
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem><FormLabel>Notes</FormLabel><FormControl><textarea className="w-full p-2 border rounded" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={createCustomer.isPending}>
          {createCustomer.isPending ? "Saving..." : "Save Customer"}
        </Button>
      </form>
    </Form>
  );
}
