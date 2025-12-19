 // server.js
import express from "express";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// POST /render/pdf
// body: { html: "<html>...</html>", filename?: "contract.pdf" }
app.post("/render/pdf", async (req, res) => {
  let browser;
  try {
    const { html, filename } = req.body || {};
    if (!html || typeof html !== "string") {
      return res.status(400).json({ error: "html is required" });
    }

    const executablePath = await chromium.executablePath();

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename || "contract.pdf"}"`
    );
    return res.status(200).send(Buffer.from(pdf));
  } catch (e) {
    console.error("render/pdf error:", e);
    return res.status(500).json({ error: e?.message || "PDF render failed" });
  } finally {
    try {
      if (browser) await browser.close();
    } catch {}
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("PDF service listening on port", port));
