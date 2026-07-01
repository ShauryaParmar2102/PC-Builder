export class PCBuilderController {
    static async init() {
        const params = new URLSearchParams(window.location.search);
        const editId = params.get("id");

        let editPC = null;

        //  FIXED STORAGE KEY
        if (editId) { // If there is an editId in the URL (means user is editing an existing PC)
            let PCList = JSON.parse(localStorage.getItem("PCs")) || []; // Get saved PCs from localStorage (or empty array if nothing saved)
            editPC = PCList.find(p => String(p.id) === String(editId)); // Find the PC that matches the editId

            if (editPC) { //If we actually find the PC edit
                // Fill the form fields with existing PC data (edit mode pre-fill)
                document.getElementById("name").value = editPC.name || "";
                document.getElementById("cpu").value = editPC.cpu || "";
                document.getElementById("gpu").value = editPC.gpu || "";
                document.getElementById("ram").value = editPC.ram || "";
                document.getElementById("storage").value = editPC.storage || "";
                document.getElementById("motherboard").value = editPC.motherboard || "";
                document.getElementById("psu").value = editPC.psu || "";
                document.getElementById("case").value = editPC.caseType || "";
            }
        }

        const form = document.getElementById("pcForm"); // Get the main form element (used for submit handling later)

        // Get all dropdown/select elements so JS can control them
        const cpuSelect = document.getElementById("cpu");
        const gpuSelect = document.getElementById("gpu");
        const ramSelect = document.getElementById("ram");
        const storageSelect = document.getElementById("storage");
        const motherboardSelect = document.getElementById("motherboard");
        const psuSelect = document.getElementById("psu");
        const caseSelect = document.getElementById("case");
        const extrasFieldset = document.getElementById("extrasFieldset"); // Get extras section (checkboxes like RGB, cooling, etc.)

        // LOAD COMPONENTS - FETCH FROM BACKEND
        const loadComponents = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/components"); //Sends request to backend API to fetch all PC components from backend

                if (!res.ok) throw new Error("Failed to fetch components");

                const components = await res.json();
                     // This connects backend component types to HTML select elements
                const map = {
                    CPU: cpuSelect,
                    GPU: gpuSelect,
                    RAM: ramSelect,
                    Storage: storageSelect,
                    Motherboard: motherboardSelect,
                    PSU: psuSelect,
                    Case: caseSelect
                };

                Object.entries(map).forEach(([type, select]) => {
                    select.innerHTML = "";

                    components
                        .filter(c => c.type === type)
                        .forEach(c => {
                            const option = document.createElement("option"); // Create a new <option> element for dropdown
                            option.value = c.name; // Value stored in form submission
                            option.textContent = c.name; // Text shown to user in dropdown
                            select.appendChild(option);  // Add option to the correct dropdown
                        });
                });

                if (editPC) { //Only runs if a PC was found in localStorage (so you are in edit mode).

                    // Sets the CPU dropdown to the saved CPU value
                    cpuSelect.value = editPC.cpu || ""; //Selects previously chosen CPU
                    gpuSelect.value = editPC.gpu || "";
                    ramSelect.value = editPC.ram || "";
                    storageSelect.value = editPC.storage || "";
                    motherboardSelect.value = editPC.motherboard || "";
                    psuSelect.value = editPC.psu || "";
                    caseSelect.value = editPC.caseType || "";
                }

            } catch (err) {
                console.error("Component load error:", err);
            }
        };

        // =========================
        // LOAD EXTRAS (optional UI)
        // =========================
        const loadExtras = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/pricing");
                if (!res.ok) throw new Error("Failed pricing fetch");

                const pricing = await res.json();
                extrasFieldset.innerHTML = "";

            } catch (err) {
                console.error("Extras error:", err);
            }
        };

        await loadComponents();
        await loadExtras();

        // =========================
        // SAVE / SUBMIT
        // =========================
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const PCData = PCBuilderController.getFormData();

            if (!PCBuilderController.validatePC(PCData)) return;

            const isUpdate =
                editId && editPC && editPC.status === "showcase";

            let url = isUpdate
                ? `http://localhost:8000/api/showcase/${editId}`
                : "http://localhost:8000/api/showcase";

            try {
                let res = await fetch(url, {
                    method: isUpdate ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(PCData)
                });

                if (res.status === 404 && isUpdate) {
                    url = "http://localhost:8000/api/showcase";

                    res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(PCData)
                    });
                }

                const data = await res.json();

                if (!res.ok) {
                    console.error(data);
                    alert(data.error || "Save failed");
                    return;
                }

                // enrich object
                PCData.totalCost = data.totalCost; // Takes calculated cost from the backend (data.totalCost) and Stores it inside your local PCData
                PCData.status = "showcase"; //Adds a label to the object called status
                PCData.id = data.id || editId; //Sets the PC’s ID: data.id → ID returned from backend (newly created build) or editId -> fallback if you're editing an existing build

                // =========================
                // LOCAL STORAGE SAVE
                // =========================
                let PCs = JSON.parse(localStorage.getItem("PCs")) || [];

                PCs = PCs.filter(
                    p =>
                        String(p.id) !== String(editId) &&
                        String(p.id) !== String(PCData.id)
                );

                PCs.push(PCData);

                localStorage.setItem("PCs", JSON.stringify(PCs));

                alert("PC saved successfully!");
                window.location.href = "/views/PCList.html";

            } catch (err) {
                console.error("Network error:", err);
                alert("Server not reachable");
            }
        });

        // =========================
        // SAVE DRAFT
        // =========================
        const saveDraftBtn = document.getElementById("saveDraftBtn");

        if (saveDraftBtn) {
            saveDraftBtn.addEventListener("click", (e) => {
                e.preventDefault();

                const PCData = PCBuilderController.getFormData();

                if (!PCBuilderController.validatePC(PCData)) return;

                let PCs = JSON.parse(localStorage.getItem("PCs")) || []; //Array of saved builds

                PCData.id = editId || `draft_${Date.now()}`;
                PCData.status = "draft";

                PCs = PCs.filter(
                    p =>
                        String(p.id) !== String(editId) &&
                        String(p.id) !== String(PCData.id)
                );

                PCs.push(PCData); //Adds new PC build into the list of saved PCs.

                localStorage.setItem("PCs", JSON.stringify(PCs)); 

                alert("Draft saved!");
                window.location.href = "/views/PCList.html";
            });
        }
    }

    // =========================
    // VALIDATION
    // =========================
    static validatePC(pcData) {
        if (!pcData.name?.trim()) return alert("Name required"), false;
        if (!pcData.cpu) return alert("CPU required"), false;
        if (!pcData.gpu) return alert("GPU required"), false;
        if (!pcData.ram) return alert("RAM required"), false;
        if (!pcData.storage) return alert("Storage required"), false;
        if (!pcData.motherboard) return alert("Motherboard required"), false;
        if (!pcData.psu) return alert("PSU required"), false;
        if (!pcData.caseType) return alert("Case required"), false;

        return true;
    }

    // =========================
    // FORM DATA
    // =========================
    static getFormData() {
        const extras = Array.from(
            document.querySelectorAll("input[name='extras']:checked")
        ).map(e => e.value);

        return {
            name: document.getElementById("name").value,
            cpu: document.getElementById("cpu").value,
            gpu: document.getElementById("gpu").value,
            ram: document.getElementById("ram").value,
            storage: document.getElementById("storage").value,
            motherboard: document.getElementById("motherboard").value,
            psu: document.getElementById("psu").value,
            caseType: document.getElementById("case").value,
            extras
        };
    }
}