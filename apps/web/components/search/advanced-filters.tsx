import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { format } from "date-fns";

export function AdvancedFilters() {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new_request">New Request</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="ai_analysis_completed">AI Analysis</SelectItem>
              <SelectItem value="sent_to_supplier">Sent to Supplier</SelectItem>
              <SelectItem value="waiting_for_supplier_response">Waiting</SelectItem>
              <SelectItem value="quotation_received">Quotation Received</SelectItem>
              <SelectItem value="price_approved">Price Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Drivetrain">Drivetrain</SelectItem>
              <SelectItem value="Braking">Braking</SelectItem>
              <SelectItem value="Suspension">Suspension</SelectItem>
              <SelectItem value="Engine">Engine</SelectItem>
              <SelectItem value="Cooling">Cooling</SelectItem>
              <SelectItem value="Filtration">Filtration</SelectItem>
              <SelectItem value="Sensors">Sensors</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {dateFrom ? format(dateFrom, "PPP") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent><Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} /></PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {dateTo ? format(dateTo, "PPP") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent><Calendar mode="single" selected={dateTo} onSelect={setDateTo} /></PopoverContent>
          </Popover>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <X className="h-4 w-4 mr-1" /> Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
