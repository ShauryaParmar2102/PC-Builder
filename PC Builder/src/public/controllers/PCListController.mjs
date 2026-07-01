import { PCListModel } from "../models/PCListModel.mjs";

export class PCListController {
  static container;
  static newBtn;
  static searchInput;
  static sortFilter;

  static searchQuery = "";
  static sortOption = "";

  static async init() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    console.log("PCList init running");

    // DOM refs
    this.container = document.getElementById("pcContainer");
    this.newBtn = document.getElementById("newPCButton");
    this.searchInput = document.getElementById("pcSearch");
    this.sortFilter = document.getElementById("sortFilter");

    // Search
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.render();
    });

    // Sort
    this.sortFilter.addEventListener("change", (e) => {
      this.sortOption = e.target.value;
      this.render();
    });

    // Load PCs
    const pcs = PCListModel.getAll();
    const sample = pcs[0];

    // Build sort dropdown (PC fields only)
    if (sample) {
      const sortFields = [
        { key: "name", label: "Name" },
        { key: "cpu", label: "CPU" },
        { key: "gpu", label: "GPU" },
        { key: "ram", label: "RAM" },
        { key: "storage", label: "Storage" },
        { key: "totalCost", label: "Cost" }
      ];

      const sortOptions = [];

      sortFields.forEach(field => {
        sortOptions.push(
          { label: `${field.label} ↑`, value: `${field.key}-asc` },
          { label: `${field.label} ↓`, value: `${field.key}-desc` }
        );
      });

      sortOptions.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        this.sortFilter.appendChild(option);
      });
    }

    // New PC button
    this.newBtn.addEventListener("click", () => {
      window.location.href = "/views/PCBuilder.html";
    });

    this.render();
  }

  static async render() {
    let pcs = PCListModel.getAll();

    // Fetch showcase data safely
    let showcaseData = [];
    try {
      const res = await fetch("http://localhost:8000/api/showcase");

      if (res.ok) {
        showcaseData = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch showcase:", err);
    }

    // Merge cost data
    pcs = pcs.map(pc => {
      const match = showcaseData.find(p => p.id === pc.id);

      return {
        ...pc,
        totalCost: match ? match.totalCost : pc.totalCost || 0
      };
    });

    // Search
    if (this.searchQuery) {
      pcs = pcs.filter(p =>
        (p.name || "").toLowerCase().includes(this.searchQuery) ||
        (p.cpu || "").toLowerCase().includes(this.searchQuery) ||
        (p.gpu || "").toLowerCase().includes(this.searchQuery) ||
        (p.ram || "").toLowerCase().includes(this.searchQuery) ||
        (p.storage || "").toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort
    if (this.sortOption) {
      const [field, direction] = this.sortOption.split("-");

      pcs.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const isNumber = typeof aVal === "number" && typeof bVal === "number";

        if (isNumber) {
          return direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    // Render
    this.container.innerHTML = "";

    if (pcs.length === 0) {
      this.container.innerHTML = `
        <p class="empty-message">
          No PC builds found. Start by creating one!
        </p>
      `;
      return;
    }

    pcs.forEach(pc => {
      const card = document.createElement("div");
      card.className = "pc-card";

      card.innerHTML = `
        <h3>${pc.name}</h3>
        <p>CPU: ${pc.cpu}</p>
        <p>GPU: ${pc.gpu}</p>
        <p>RAM: ${pc.ram}</p>
        <p>Storage: ${pc.storage}</p>
        <p>Motherboard: ${pc.motherboard}</p>
        <p>PSU: ${pc.psu}</p>
        <p>Case: ${pc.caseType}</p>
        <p><b>Total Cost:</b> $${pc.totalCost ? pc.totalCost.toLocaleString() : "0"}</p>
      `;

      // Delete
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", () => {
        PCListModel.delete(pc.id);
        this.render();
      });

      card.appendChild(deleteButton);

      // Edit
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";

      editButton.addEventListener("click", () => {
        window.location.href = `/views/PCBuilder.html?id=${pc.id}`;
      });

      card.appendChild(editButton);

      this.container.appendChild(card);
    });
  }
}