import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleInfo } from "@/components/vins/vehicle-info";
import { PartsList } from "@/components/vins/parts-list";
import { SupplierList } from "@/components/vins/supplier-list";
import { CustomerList } from "@/components/vins/customer-list";
import { DocumentList } from "@/components/vins/document-list";
import { ConversationList } from "@/components/vins/conversation-list";
import { OrderTimeline } from "@/components/vins/order-timeline";

interface VINWorkspaceProps {
  vin: string;
}

export function VINWorkspace({ vin }: VINWorkspaceProps) {
  return (
    <div className="space-y-6">
      <VehicleInfo vin={vin} />
      <Tabs defaultValue="parts">
        <TabsList>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="parts"><PartsList vin={vin} /></TabsContent>
        <TabsContent value="suppliers"><SupplierList vin={vin} /></TabsContent>
        <TabsContent value="customers"><CustomerList vin={vin} /></TabsContent>
        <TabsContent value="documents"><DocumentList vin={vin} /></TabsContent>
        <TabsContent value="conversations"><ConversationList vin={vin} /></TabsContent>
        <TabsContent value="orders"><OrderTimeline vin={vin} /></TabsContent>
      </Tabs>
    </div>
  );
}
