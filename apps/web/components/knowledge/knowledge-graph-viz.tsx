import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function KnowledgeGraphVisualization() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = [
    { id: "vin_1", label: "VIN: 5TDKK3DC8FS559892", type: "vin" },
    { id: "part_1", label: "Brake Disc", type: "part" },
    { id: "part_2", label: "CV Joint", type: "part" },
    { id: "supplier_1", label: "Supplier A", type: "supplier" },
    { id: "customer_1", label: "Customer X", type: "customer" },
  ];

  const edges = [
    { source: "vin_1", target: "part_1", type: "contains_part" },
    { source: "vin_1", target: "part_2", type: "contains_part" },
    { source: "part_1", target: "supplier_1", type: "quoted_by" },
    { source: "vin_1", target: "customer_1", type: "requested_by" },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Knowledge Graph</CardTitle></CardHeader>
      <CardContent>
        <div className="h-[400px] border rounded-lg bg-muted/20 relative overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 800 400">
            {edges.map((edge, i) => (
              <line key={i} x1="200" y1="200" x2="400" y2="100" stroke="#ccc" strokeWidth="1" />
            ))}
            {nodes.map((node) => (
              <g key={node.id} onClick={() => setSelectedNode(node.id)} className="cursor-pointer">
                <circle cx="200" cy="200" r="30" fill={
                  node.type === "vin" ? "#3b82f6" :
                  node.type === "part" ? "#10b981" :
                  node.type === "supplier" ? "#f59e0b" : "#8b5cf6"
                } />
                <text x="200" y="205" textAnchor="middle" fill="white" fontSize="8">{node.label.slice(0, 10)}</text>
              </g>
            ))}
          </svg>
          {selectedNode && (
            <div className="absolute bottom-4 left-4 bg-background border rounded-lg p-3 shadow-lg">
              <p className="text-sm font-medium">Node: {selectedNode}</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500" />VIN</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" />Part</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" />Supplier</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500" />Customer</div>
        </div>
      </CardContent>
    </Card>
  );
}
