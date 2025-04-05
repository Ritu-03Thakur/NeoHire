const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs-extra");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 5000;
const AI_MODEL_URL = "http://localhost:8000/score";

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post(
  "/api/extract-text",
  upload.fields([
    { name: "files", maxCount: 10 }, // Resume files
    { name: "jd", maxCount: 1 },     // JD file
  ]),
  async (req, res) => {
    try {
      const resumesRaw = req.files?.files || [];
      const jdRaw = req.files?.jd?.[0];

      let extractedResumes = [];
      let jdText = "";

      const extractText = async (file) => {
        const fileType = file.mimetype;
        const filePath = file.path;
        let text = "";

        if (fileType === "application/pdf") {
          const data = await pdfParse(fs.readFileSync(filePath));
          text = data.text;
        } else if (
          fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const data = await mammoth.extractRawText({ path: filePath });
          text = data.value;
        } else if (fileType === "text/plain") {
          text = fs.readFileSync(filePath, "utf8");
        }

        fs.removeSync(filePath);
        return text;
      };

      for (let file of resumesRaw) {
        const extractedText = await extractText(file);
        extractedResumes.push({
          id: `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          filename: file.originalname,
          text: extractedText,
        });
      }

      if (jdRaw) {
        jdText = await extractText(jdRaw);
      }

      // Send to AI model
      let aiResponse;
      try {
        aiResponse = await axios.post(AI_MODEL_URL, {
          resumes: extractedResumes,
          job_description: jdText,
        });
      } catch (error) {
        console.error("AI model error:", error.message);
        aiResponse = { data: { message: "AI scoring failed", score: null } };
      }

      res.json({
        extracted_resumes: extractedResumes,
        ai_parsed_resumes: aiResponse.data,
      });

      console.log("✅ Resume Extraction Done");
      console.log("📦 Resumes:", extractedResumes);
      console.log("📄 JD:", jdText);
      console.log("🤖 AI Response:", aiResponse.data);
    } catch (error) {
      console.error("❌ Error processing file:", error);
      res.status(500).json({ error: "Error extracting text" });
    }
  }
);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
