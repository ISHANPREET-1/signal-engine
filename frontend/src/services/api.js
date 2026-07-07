const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://signal-engine-5muf.onrender.com/api";

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

export async function runBatchPipeline(data) {
  const response = await fetch(`${API_URL}/run-pipeline-batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Batch pipeline failed");
  }

  return result;
}

export async function runPlg(data) {
  const response = await fetch(`${API_URL}/run-plg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "PLG scoring failed");
  }

  return result;
}