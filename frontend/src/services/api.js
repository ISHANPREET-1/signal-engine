const API_URL = "http://localhost:5000/api";

export async function runPipeline(data) {
  const response = await fetch(`${API_URL}/run-pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Pipeline failed");
  }

  return result;
}