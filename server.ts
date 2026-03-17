
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { costAccountingEngine } from "./services/costAccountingEngine";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/agro-lang", async (req, res) => {
    const { model, contents, config } = req.body;
    
    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "EA_AI_API_KEY not configured on server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents,
        config
      });

      // Account for usage
      // Estimating tokens (rough approximation: 4 chars per token)
      const inputTokens = JSON.stringify(contents).length / 4;
      const outputTokens = (response.text || "").length / 4;
      await costAccountingEngine.accountAIUsage(inputTokens + outputTokens, model);

      res.json(response);
    } catch (error: any) {
      console.error("Backend Agro Lang Error:", error);
      res.status(error.status || 500).json({ error: error.message });
    }
  });

  app.post("/api/ea-ai/video", async (req, res) => {
    const { prompt } = req.body;
    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey! });
      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });
      
      // Account for video generation (higher cost)
      await costAccountingEngine.recordTransaction({
        type: 'COST',
        category: 'EA_AI_API',
        amount: 2.50, // Simulated cost for video generation
        description: `Agro Lang Video Generation: ${prompt.slice(0, 30)}...`
      });

      res.json(operation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ea-ai/video/operation", async (req, res) => {
    const { operation } = req.body;
    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey! });
      const result = await ai.operations.getVideosOperation({ operation });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/accounting/report", (req, res) => {
    console.log("GET /api/accounting/report hit");
    try {
      res.json(costAccountingEngine.getFinancialReport());
    } catch (error: any) {
      console.error("Error in /api/accounting/report:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/accounting/wallet", (req, res) => {
    console.log("GET /api/accounting/wallet hit");
    try {
      res.json({ balance: costAccountingEngine.getWalletBalance() });
    } catch (error: any) {
      console.error("Error in /api/accounting/wallet:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/accounting/transactions", (req, res) => {
    console.log("GET /api/accounting/transactions hit");
    try {
      res.json(costAccountingEngine.getTransactions());
    } catch (error: any) {
      console.error("Error in /api/accounting/transactions:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EnvirosAgro Server running on http://localhost:${PORT}`);
    
    // Run background optimization every hour
    setInterval(() => {
      costAccountingEngine.runAIOptimization();
    }, 3600000);
  });
}

startServer();
