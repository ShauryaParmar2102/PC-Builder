import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Controllers
import ComponentController from "./controllers/ComponentController.mjs";
import { PCPricingController } from "./controllers/PCPricingController.mjs";
import { PCShowcaseController } from "./controllers/PCShowcaseController.mjs";

// ----------------------------
// Setup __dirname (ESM fix)
// ----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------
// App
// ----------------------------
const app = express();
const PORT = 8000;

// ----------------------------
// Middleware
// ----------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files (IMPORTANT FIX)
app.use(express.static(path.join(__dirname, "./public")));

// ----------------------------
// Pages
// ----------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/PCList.html"));
});

app.get("/builder", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/PCBuilder.html"));
});

app.get("/showcase", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/showcase.html"));
});

// ----------------------------
// COMPONENT ROUTES
// ----------------------------
app.get("/components", ComponentController.PClist);
app.get("/api/components", ComponentController.getComponentListJSON);

// ----------------------------
// PRICING ROUTES
// ----------------------------
app.get("/api/pricing", PCPricingController.getPCPricing);
app.get("/api/pricing/extras/:extraName", PCPricingController.getExtraPrice);

// ----------------------------
// SHOWCASE ROUTES (SAFE VERSION)
// ----------------------------

// GET (safe only if implemented)
if (PCShowcaseController.getShowcaseJSON) {
  app.get("/api/showcase", PCShowcaseController.getShowcaseJSON);
}

// POST (safe only if implemented)
if (PCShowcaseController.publishPCBuild) {
  app.post("/api/showcase", PCShowcaseController.publishPCBuild);
}

// UPDATE (only if exists)
if (PCShowcaseController.updatePCBuild) {
  app.put("/api/showcase/:id", PCShowcaseController.updatePCBuild);
}

// DELETE (only if exists)
if (PCShowcaseController.deletePCBuild) {
  app.delete("/api/showcase/:id", PCShowcaseController.deletePCBuild);
}

// ----------------------------
// START SERVER
// ----------------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});