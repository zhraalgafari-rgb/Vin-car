import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function VinFilters() {
  return (
    <div className="flex gap-4">
      <div>
        <Label>Market</Label>
        <Select>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="All markets" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="GCC">GCC</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Asia">Asia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Year</Label>
        <Select>
          <SelectTrigger className="w-[120px]"><SelectValue placeholder="All years" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
