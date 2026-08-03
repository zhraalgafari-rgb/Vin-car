import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "imageUrl is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const analysis = {
      partType: "Brake Disc",
      brand: "Brembo",
      oemMarkings: ["BRM-2024"],
      condition: "new",
      confidence: 0.9,
    };

    return new Response(
      JSON.stringify({ analysis }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Vision error:", error);
    return new Response(
      JSON.stringify({ error: "Vision analysis failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
