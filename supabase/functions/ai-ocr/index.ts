import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { imageUrl, ocrEngine = "tesseract" } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "imageUrl is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = btoa(
      new Uint8Array(imageBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    const { Tesseract } = await import("https://esm.sh/tesseract.js@5.0.0");
    const { data: ocrResult } = await Tesseract.recognize(imageBase64, "eng+ara", {
      logger: (m) => console.log(m),
    });

    return new Response(
      JSON.stringify({
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        engine: ocrEngine,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("OCR error:", error);
    return new Response(
      JSON.stringify({ error: "OCR processing failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
