import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    return new Response(
      JSON.stringify({ status: "scheduled tasks completed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Schedule error:", error);
    return new Response(
      JSON.stringify({ error: "Scheduled tasks failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
