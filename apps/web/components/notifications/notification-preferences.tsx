import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NotificationPreferences() {
  const preferences = [
    { key: "supplier_overdue", label: "Supplier overdue notifications", default: true },
    { key: "quotation_delayed", label: "Quotation delay notifications", default: true },
    { key: "customer_waiting", label: "Customer waiting notifications", default: true },
    { key: "followup_due", label: "Follow-up reminders", default: true },
    { key: "shipment_arrived", label: "Shipment arrival notifications", default: true },
    { key: "ai_extraction", label: "AI extraction completion", default: true },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preferences.map((pref) => (
            <div key={pref.key} className="flex items-center justify-between">
              <Label>{pref.label}</Label>
              <Switch defaultChecked={pref.default} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
