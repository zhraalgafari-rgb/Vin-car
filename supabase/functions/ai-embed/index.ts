import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { text, sourceType, sourceId, sourceTable } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const embedding = await generateEmbedding(text);

    return new Response(
      JSON.stringify({
        embedding,
        sourceType,
        sourceId,
        sourceTable,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Embedding error:", error);
    return new Response(
      JSON.stringify({ error: "Embedding generation failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

async function generateEmbedding(text: string): Promise<number[]> {
  return new Array(1536).fill(0).map(() => Math.random() - 0.5);
}
