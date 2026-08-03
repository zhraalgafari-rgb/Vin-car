export async function runVision(imageUrl: string) {
  const response = await fetch("/api/ai/vision", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });
  if (!response.ok) throw new Error("Vision analysis failed");
  return response.json();
}
