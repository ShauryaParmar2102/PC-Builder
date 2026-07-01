import { PCShowcaseModel } from "../models/PCShowcaseModel.mjs";
import { PCPricingModel } from "../models/PCPricingModel.mjs";
import { ComponentModel } from "../models/ComponentModel.mjs";

export class PCShowcaseController {

  static async getShowcaseJSON(req, res) {
    try {
      const allPCs = PCShowcaseModel.getAll();
      return res.status(200).json(allPCs);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to load showcase" });
    }
  }

  static async publishPCBuild(req, res) {
    try {
      const pc = req.body;

      const pricing = await PCPricingModel.getPricing();
      const components = await ComponentModel.getAll();

      const errors = [];

      // -------------------
      // BASIC VALIDATION
      // -------------------
      if (!pc.name?.trim()) errors.push("Invalid PC name");
      if (!pc.cpu) errors.push("Invalid CPU");
      if (!pc.gpu) errors.push("Invalid GPU");

      // -------------------
      // LOOKUPS (FIXED TYPES)
      // -------------------
      const cpuExists = components.find(c => c.type === "CPU" && c.name === pc.cpu);
      const gpuExists = components.find(c => c.type === "GPU" && c.name === pc.gpu);
      const ramExists = components.find(c => c.type === "RAM" && c.name === pc.ram);
      const storageExists = components.find(c => c.type === "Storage" && c.name === pc.storage);
      const motherboardExists = components.find(c => c.type === "Motherboard" && c.name === pc.motherboard);
      const psuExists = components.find(c => c.type === "PSU" && c.name === pc.psu);
      const caseExists = components.find(c => c.type === "Case" && c.name === pc.caseType);

      // DEBUG: check what is actually being found
      console.log("CPU:", cpuExists);
      console.log("GPU:", gpuExists);
      console.log("RAM:", ramExists);
      console.log("Storage:", storageExists);
      console.log("Motherboard:", motherboardExists);
      console.log("PSU:", psuExists);
      console.log("Case:", caseExists);

      // required checks
      if (!cpuExists) errors.push("CPU not found");
      if (!gpuExists) errors.push("GPU not found");

      if (errors.length) {
        return res.status(400).json({ errors });
      }

      // -------------------
      // COST CALCULATION 
      // -------------------
      let totalCost = 0;

      totalCost += cpuExists?.price || 0;
      totalCost += gpuExists?.price || 0;
      totalCost += ramExists?.price || 0;
      totalCost += storageExists?.price || 0;
      totalCost += motherboardExists?.price || 0;
      totalCost += psuExists?.price || 0;
      totalCost += caseExists?.price || 0;

      // extras
      (pc.extras || []).forEach(extraName => {
        const extra = pricing.extras.find(e => e.name === extraName);
        if (extra) totalCost += extra.price;
      });

      // -------------------
      // BUILD OBJECT
      // -------------------
      const build = {
        id: pc.id || `pc_${Date.now()}`,
        name: pc.name,
        cpu: pc.cpu,
        gpu: pc.gpu,
        ram: pc.ram,
        storage: pc.storage,
        motherboard: pc.motherboard,
        psu: pc.psu,
        caseType: pc.caseType,
        extras: pc.extras || [],
        totalCost
      };

      const saved = PCShowcaseModel.add(build);

      return res.status(201).json(saved);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to publish build" });
    }
  }

  static async deletePCBuild(req, res) {
    try {
      const { id } = req.params;

      const deleted = PCShowcaseModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Build not found" });
      }

      return res.status(200).json({ message: "Deleted successfully", id });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Delete failed" });
    }
  }
}