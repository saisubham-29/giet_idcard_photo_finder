import { get } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const blob = await get("likes.json");
    const text = await blob.text();
    res.status(200).json(JSON.parse(text));
  } catch {
    res.status(200).json({ likes: 0, comments: [] });
  }
}
