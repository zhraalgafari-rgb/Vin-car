import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface QuoteTableProps {
  quotes: any[];
}

export function QuoteTable({ quotes = [] }: QuoteTableProps) {
  if (quotes.length === 0) {
    return <Card><CardContent className="p-6 text-center text-muted-foreground">No quotes yet</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Supplier Quotes</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quotes.map((quote: any) => (
            <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{quote.supplier?.name || "Unknown Supplier"}</p>
                <p className="text-sm text-muted-foreground">
                  {quote.quoted_price} {quote.currency} • MOQ: {quote.moq}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={
                  quote.reply_status === "replied" ? "bg-green-100 text-green-800" :
                  quote.reply_status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  quote.reply_status === "overdue" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }>
                  {quote.reply_status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
