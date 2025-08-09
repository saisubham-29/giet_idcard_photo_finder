export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { likes, comments } = req.body;

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": process.env.JSONBIN_KEY
      },
      body: JSON.stringify({ likes, comments })
    });

    const data = await response.json();
    res.status(200).json(data.record);
  } catch (error) {
    res.status(500).json({ message: "Failed to update likes" });
  }
}
