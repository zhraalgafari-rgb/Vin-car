import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function PartForm() {
  const form = useForm({
    resolver: zodResolver(partSchema),
    defaultValues: {
      englishName: "",
      arabicName: "",
      oemNumber: "",
      partCategory: "",
      notes: "",
      quantity: 0,
      status: "in_stock",
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="englishName" render={({ field }) => (
          <FormItem><FormLabel>English Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="arabicName" render={({ field }) => (
          <FormItem><FormLabel>Arabic Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="oemNumber" render={({ field }) => (
          <FormItem><FormLabel>OEM Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="partCategory" render={({ field }) => (
          <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit">Save Part</Button>
      </form>
    </Form>
  );
}
