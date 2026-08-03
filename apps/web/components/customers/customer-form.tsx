import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function CustomerForm() {
  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", customerType: "wholesaler" },
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit">Save Customer</Button>
      </form>
    </Form>
  );
}
