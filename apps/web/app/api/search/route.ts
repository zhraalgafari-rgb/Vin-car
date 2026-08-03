import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";

  if (type === "part") {
    const { data: parts, error } = await supabase
      .from("parts")
      .select("*")
      .or(`english_name.ilike.%${query}%,oem_number.ilike.%${query}%`)
      .limit(20);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ results: parts ?? [], type: "parts" });
  }

  const { data, error } = await supabase
    .from("vin_records")
    .select("*")
    .or(`vin.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`)
    .limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ results: data ?? [], type: "vins" });
}
