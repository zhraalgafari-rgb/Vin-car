export async function runExtraction(text: string, sourceType: string = "ocr") {
  const response = await fetch("/api/ai/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, sourceType }),
  });
  if (!response.ok) throw new Error("Extraction failed");
  return response.json();
}
