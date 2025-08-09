export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}/latest`, {
      headers: {
        "X-Master-Key": process.env.JSONBIN_KEY
      }
    });

    const data = await response.json();
    res.status(200).json(data.record);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch likes" });
  }
}
