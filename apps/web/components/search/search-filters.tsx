import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function SearchFilters() {
  return (
    <div className="space-y-4">
      <div>
        <Label>Type</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="vin">VIN</SelectItem>
            <SelectItem value="part">Part</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="order">Order</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
