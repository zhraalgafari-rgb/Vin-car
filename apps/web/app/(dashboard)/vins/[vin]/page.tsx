import { VehicleInfo } from "@/components/vins/vehicle-info";
import { PartsList } from "@/components/vins/parts-list";
import { SupplierList } from "@/components/vins/supplier-list";
import { CustomerList } from "@/components/vins/customer-list";
import { DocumentList } from "@/components/vins/document-list";
import { ConversationList } from "@/components/vins/conversation-list";
import { OrderTimeline } from "@/components/vins/order-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VINWorkspacePage({
  params,
}: {
  params: { vin: string };
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{params.vin}</h1>
      <VehicleInfo vin={params.vin} />
      <Tabs defaultValue="parts">
        <TabsList>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="parts"><PartsList vin={params.vin} /></TabsContent>
        <TabsContent value="suppliers"><SupplierList vin={params.vin} /></TabsContent>
        <TabsContent value="customers"><CustomerList vin={params.vin} /></TabsContent>
        <TabsContent value="documents"><DocumentList vin={params.vin} /></TabsContent>
        <TabsContent value="conversations"><ConversationList vin={params.vin} /></TabsContent>
        <TabsContent value="orders"><OrderTimeline vin={params.vin} /></TabsContent>
      </Tabs>
    </div>
  );
}
