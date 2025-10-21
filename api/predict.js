import formidable from "formidable";
import fs from "fs";
import { Client } from "@gradio/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const client = await Client.connect("Neo0110/my-pneumonia-model");
      const file = files.image;

      // Read file as buffer
      const fileBuffer = fs.readFileSync(file.filepath);

      // Convert to Blob-like object
      const blob = new Blob([fileBuffer]);

      // Call Gradio Space
      const result = await client.predict({ image: blob });

      res.status(200).json({ result: result.data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Prediction failed" });
    }
  });
}
