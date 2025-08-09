import { put, get } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let currentData = { likes: 0, comments: [] };
    try {
      const blob = await get("likes.json");
      const text = await blob.text();
      currentData = JSON.parse(text);
    } catch {}

    const { like, comment, username } = req.body;

    if (like) currentData.likes += 1;

    if (comment && username) {
      currentData.comments.push({
        username,
        text: comment,
        timestamp: new Date().toISOString()
      });
    }

    await put("likes.json", JSON.stringify(currentData), {
      contentType: "application/json",
      access: "public"
    });

    res.status(200).json(currentData);
  } catch {
    res.status(500).json({ error: "Failed to update likes/comments" });
  }
}
