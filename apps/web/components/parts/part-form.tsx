import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePart } from "@/hooks/use-parts";
import { useQueryClient } from "@tanstack/react-query";

interface PartFormProps {
  vinId?: string;
  onSaved?: () => void;
}

export function PartForm({ vinId, onSaved }: PartFormProps) {
  const form = useForm({
    resolver: zodResolver(partSchema),
    defaultValues: {
      vin_id: vinId,
      englishName: "",
      arabicName: "",
      oemNumber: "",
      partCategory: "",
      notes: "",
      quantity: 0,
      status: "in_stock",
    },
  });

  const createPart = useCreatePart();
  const queryClient = useQueryClient();

  const onSubmit = async (values: any) => {
    await createPart.mutateAsync(values);
    queryClient.invalidateQueries({ queryKey: ["parts"] });
    onSaved?.();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg mb-4">
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
          <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl><SelectContent>{["Drivetrain","Braking","Suspension","Engine","Cooling","Filtration","Sensors","Clutch","Drive Train","Exterior","Electrical","Body","Interior","Steering"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></FormItem>
        )} />
        <FormField control={form.control} name="quantity" render={({ field }) => (
          <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="in_stock">In Stock</SelectItem><SelectItem value="out_of_stock">Out of Stock</SelectItem><SelectItem value="ordered">Ordered</SelectItem><SelectItem value="discontinued">Discontinued</SelectItem></SelectContent></Select></FormItem>
        )} />
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={createPart.isPending}>
          {createPart.isPending ? "Saving..." : "Save Part"}
        </Button>
      </form>
    </Form>
  );
}
