export async function runEmbedding(text: string) {
  const response = await fetch("/api/ai/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Embedding failed");
  return response.json();
}
