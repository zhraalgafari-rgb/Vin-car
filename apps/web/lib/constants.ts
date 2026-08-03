export const ORDER_STATUSES = [
  "new_request",
  "under_review",
  "ai_analysis_completed",
  "sent_to_supplier",
  "waiting_for_supplier_response",
  "quotation_received",
  "price_approved",
  "purchase_confirmed",
  "production",
  "shipping",
  "arrived",
  "delivered",
  "completed",
  "cancelled",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new_request: "New Request",
  under_review: "Under Review",
  ai_analysis_completed: "AI Analysis Completed",
  sent_to_supplier: "Sent to Supplier",
  waiting_for_supplier_response: "Waiting for Supplier",
  quotation_received: "Quotation Received",
  price_approved: "Price Approved",
  purchase_confirmed: "Purchase Confirmed",
  production: "Production",
  shipping: "Shipping",
  arrived: "Arrived",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<string, string> = {
  new_request: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  ai_analysis_completed: "bg-purple-100 text-purple-800",
  sent_to_supplier: "bg-indigo-100 text-indigo-800",
  waiting_for_supplier_response: "bg-orange-100 text-orange-800",
  quotation_received: "bg-teal-100 text-teal-800",
  price_approved: "bg-green-100 text-green-800",
  purchase_confirmed: "bg-emerald-100 text-emerald-800",
  production: "bg-cyan-100 text-cyan-800",
  shipping: "bg-sky-100 text-sky-800",
  arrived: "bg-lime-100 text-lime-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export const PART_CATEGORIES = [
  "Drivetrain",
  "Braking",
  "Suspension",
  "Engine",
  "Cooling",
  "Filtration",
  "Sensors",
  "Clutch",
  "Drive Train",
  "Exterior",
  "Electrical",
  "Body",
  "Interior",
  "Steering",
  "Electrical",
];

export const DRIVE_TYPES = ["2WD", "AWD", "4WD", "RWD", "FWD"];
export const FUEL_TYPES = ["Gasoline", "Diesel", "Electric", "Hybrid", "CNG", "LPG"];
export const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "DCT", "AMT"];
export const BODY_STYLES = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Truck", "Van", "Wagon", "Pickup"];
