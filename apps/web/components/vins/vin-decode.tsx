import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Car } from "lucide-react";
import { useCreateVIN } from "@/hooks/use-vin";
import { useQueryClient } from "@tanstack/react-query";

interface VINDecodeProps {
  onVINCreated?: (vin: string) => void;
}

export function VINDecode({ onVINCreated }: VINDecodeProps) {
  const [vin, setVin] = useState("");
  const [decoding, setDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<any>(null);
  const createVIN = useCreateVIN();
  const queryClient = useQueryClient();

  const handleDecode = async () => {
    if (vin.length !== 17) return;
    setDecoding(true);

    try {
      // Try NHTSA VIN decoder API
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
      );
      const data = await response.json();

      if (data.Results && data.Results.length > 0) {
        const decoded = extractVINData(data.Results);
        setDecodedData(decoded);
      } else {
        setDecodedData({ vin, error: "Unable to decode this VIN" });
      }
    } catch (error) {
      console.error("VIN decode error:", error);
      setDecodedData({ vin, error: "Decode failed" });
    } finally {
      setDecoding(false);
    }
  };

  const handleSave = async () => {
    if (!decodedData || decodedData.error) return;

    await createVIN.mutateAsync({
      vin: decodedData.vin,
      manufacturer: decodedData.manufacturer,
      brand: decodedData.brand,
      model: decodedData.model,
      production_year: decodedData.productionYear,
      market: decodedData.market,
      engine_code: decodedData.engineCode,
      engine_size: decodedData.engineSize,
      fuel_type: decodedData.fuelType,
      transmission: decodedData.transmission,
      drive_type: decodedData.driveType,
      trim_level: decodedData.trimLevel,
      body_style: decodedData.bodyStyle,
      country_of_origin: decodedData.countryOfOrigin,
      decoded_data: decodedData,
    });

    queryClient.invalidateQueries({ queryKey: ["vins"] });
    onVINCreated?.(decodedData.vin);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          VIN Decoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter 17-character VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            maxLength={17}
            className="font-mono"
          />
          <Button onClick={handleDecode} disabled={decoding || vin.length !== 17}>
            {decoding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Decode"
            )}
          </Button>
        </div>

        {decodedData && !decodedData.error && (
          <div className="space-y-2">
            <h4 className="font-semibold">Decoded Vehicle</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Manufacturer:</span> {decodedData.manufacturer}</div>
              <div><span className="text-muted-foreground">Brand:</span> {decodedData.brand}</div>
              <div><span className="text-muted-foreground">Model:</span> {decodedData.model}</div>
              <div><span className="text-muted-foreground">Year:</span> {decodedData.productionYear}</div>
              <div><span className="text-muted-foreground">Engine:</span> {decodedData.engineCode}</div>
              <div><span className="text-muted-foreground">Fuel:</span> {decodedData.fuelType}</div>
              <div><span className="text-muted-foreground">Transmission:</span> {decodedData.transmission}</div>
              <div><span className="text-muted-foreground">Drive:</span> {decodedData.driveType}</div>
            </div>
            <Button onClick={handleSave} disabled={createVIN.isPending}>
              {createVIN.isPending ? "Saving..." : "Save to VIN Records"}
            </Button>
          </div>
        )}

        {decodedData?.error && (
          <div className="text-destructive text-sm">{decodedData.error}</div>
        )}
      </CardContent>
    </Card>
  );
}

function extractVINData(results: any[]): any {
  const getValue = (variable: string) => {
    const item = results.find((r: any) => r.Variable === variable);
    return item?.Value || null;
  };

  return {
    vin: getValue("VIN"),
    manufacturer: getValue("Manufacturer"),
    brand: getValue("Make"),
    model: getValue("Model"),
    productionYear: getValue("Model Year"),
    market: getValue("Market") || "USA",
    engineCode: getValue("Engine Configuration"),
    engineSize: getValue("Displacement (L)",
    fuelType: getValue("Fuel Type"),
    transmission: getValue("Transmission Style"),
    driveType: getValue("Drive Type"),
    trimLevel: getValue("Trim"),
    bodyStyle: getValue("Body Class"),
    countryOfOrigin: getValue("Country"),
  };
}
