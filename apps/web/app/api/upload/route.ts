import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const vinId = formData.get("vinId") as string;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const filePath = `${user.id}/${vinId || "general"}/${file.name}`;
  const { error: uploadError } = await supabase.storage.from("uploads").upload(filePath, file);

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  await supabase.functions.invoke("ai-process-upload", {
    body: { fileUrl: filePath, fileType: file.type },
  });

  return NextResponse.json({ filePath, fileName: file.name });
}
