import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { text, sourceType = "ocr" } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const extractedData = {
      vins: extractVINs(text),
      oemNumbers: extractOEMNumbers(text),
      partNames: extractPartNames(text),
      dimensions: extractDimensions(text),
      supplierInfo: extractSupplierInfo(text),
      customerInfo: extractCustomerInfo(text),
      quotes: extractQuotes(text),
    };

    return new Response(
      JSON.stringify({
        data: extractedData,
        sourceType,
        confidence: 0.85,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Extraction error:", error);
    return new Response(
      JSON.stringify({ error: "Extraction failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

function extractVINs(text: string): string[] {
  const vinRegex = /[A-HJ-NPR-Z0-9]{17}/g;
  const matches = text.match(vinRegex);
  return matches ? [...new Set(matches)] : [];
}

function extractOEMNumbers(text: string): string[] {
  const oemRegex = /[A-Z0-9]{6,10}/g;
  const matches = text.match(oemRegex);
  return matches ? [...new Set(matches)] : [];
}

function extractPartNames(text: string): string[] {
  return [];
}

function extractDimensions(text: string): Record<string, number> | null {
  return null;
}

function extractSupplierInfo(text: string): Record<string, string> | null {
  return null;
}

function extractCustomerInfo(text: string): Record<string, string> | null {
  return null;
}

function extractQuotes(text: string): Record<string, number>[] {
  return [];
}
