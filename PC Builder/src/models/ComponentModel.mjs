export class ComponentModel {
  constructor(name, type, price) {
    this.name = name;
    this.type = type;
    this.price = price;
  }

 static async getAll() {
  const data = [

    // CPUs 
    { name: "Ryzen 5 5600", type: "CPU", price: 200 },
    { name: "Ryzen 5 5600X", type: "CPU", price: 230 },
    { name: "Ryzen 7 5700X", type: "CPU", price: 320 },
    { name: "Ryzen 7 5800X", type: "CPU", price: 360 },
    { name: "Ryzen 9 5900X", type: "CPU", price: 500 },
    { name: "Ryzen 9 5950X", type: "CPU", price: 700 },
    { name: "Intel i5-12400F", type: "CPU", price: 220 },
    { name: "Intel i5-12600K", type: "CPU", price: 280 },
    { name: "Intel i7-12700K", type: "CPU", price: 380 },
    { name: "Intel i9-12900K", type: "CPU", price: 600 },

    // GPUs 
    { name: "RTX 3060", type: "GPU", price: 450 },
    { name: "RTX 3060 Ti", type: "GPU", price: 520 },
    { name: "RTX 4060", type: "GPU", price: 500 },
    { name: "RTX 4060 Ti", type: "GPU", price: 600 },
    { name: "RTX 4070", type: "GPU", price: 850 },
    { name: "RTX 4070 Super", type: "GPU", price: 950 },
    { name: "RTX 4080", type: "GPU", price: 1600 },
    { name: "RX 7600", type: "GPU", price: 450 },
    { name: "RX 7700 XT", type: "GPU", price: 700 },
    { name: "RX 7800 XT", type: "GPU", price: 900 },

    // RAM 
    { name: "8GB DDR4 3200MHz", type: "RAM", price: 45 },
    { name: "16GB DDR4 3000MHz", type: "RAM", price: 80 },
    { name: "16GB DDR4 3600MHz", type: "RAM", price: 95 },
    { name: "32GB DDR4 3200MHz", type: "RAM", price: 140 },
    { name: "32GB DDR4 3600MHz", type: "RAM", price: 160 },
    { name: "64GB DDR4 3200MHz", type: "RAM", price: 250 },
    { name: "16GB DDR5 5200MHz", type: "RAM", price: 120 },
    { name: "32GB DDR5 5600MHz", type: "RAM", price: 220 },
    { name: "32GB DDR5 6000MHz", type: "RAM", price: 260 },
    { name: "64GB DDR5 6000MHz", type: "RAM", price: 420 },

    // Storage 
    { name: "250GB SATA SSD", type: "Storage", price: 40 },
    { name: "500GB SATA SSD", type: "Storage", price: 60 },
    { name: "1TB SATA SSD", type: "Storage", price: 90 },
    { name: "1TB NVMe SSD Gen3", type: "Storage", price: 100 },
    { name: "1TB NVMe SSD Gen4", type: "Storage", price: 130 },
    { name: "2TB SATA SSD", type: "Storage", price: 150 },
    { name: "2TB NVMe SSD Gen3", type: "Storage", price: 170 },
    { name: "2TB NVMe SSD Gen4", type: "Storage", price: 220 },
    { name: "4TB HDD", type: "Storage", price: 120 },
    { name: "8TB HDD", type: "Storage", price: 200 },

    // Motherboards 
    { name: "A520 Motherboard", type: "Motherboard", price: 120 },
    { name: "B450 Motherboard", type: "Motherboard", price: 130 },
    { name: "B550 Motherboard", type: "Motherboard", price: 180 },
    { name: "X570 Motherboard", type: "Motherboard", price: 300 },
    { name: "A620 Motherboard", type: "Motherboard", price: 150 },
    { name: "B650 Motherboard", type: "Motherboard", price: 220 },
    { name: "X670 Motherboard", type: "Motherboard", price: 350 },
    { name: "H610 Motherboard", type: "Motherboard", price: 140 },
    { name: "B660 Motherboard", type: "Motherboard", price: 200 },
    { name: "Z690 Motherboard", type: "Motherboard", price: 350 },

    // PSUs 
    { name: "500W PSU Bronze", type: "PSU", price: 70 },
    { name: "600W PSU Bronze", type: "PSU", price: 90 },
    { name: "650W PSU Bronze", type: "PSU", price: 100 },
    { name: "650W PSU Gold", type: "PSU", price: 120 },
    { name: "750W PSU Bronze", type: "PSU", price: 130 },
    { name: "750W PSU Gold", type: "PSU", price: 150 },
    { name: "850W PSU Gold", type: "PSU", price: 170 },
    { name: "850W PSU Platinum", type: "PSU", price: 200 },
    { name: "1000W PSU Gold", type: "PSU", price: 240 },
    { name: "1200W PSU Platinum", type: "PSU", price: 300 },

    // Cases 
    { name: "NZXT H5 Flow", type: "Case", price: 120 },
    { name: "NZXT H7 Elite", type: "Case", price: 180 },
    { name: "Corsair 4000D Airflow", type: "Case", price: 140 },
    { name: "Corsair 5000D Airflow", type: "Case", price: 190 },
    { name: "Lian Li Lancool 216", type: "Case", price: 180 },
    { name: "Lian Li O11 Dynamic", type: "Case", price: 220 },
    { name: "Fractal Design Meshify C", type: "Case", price: 160 },
    { name: "Fractal Pop Air", type: "Case", price: 130 },
    { name: "Cooler Master TD500", type: "Case", price: 150 },
    { name: "Phanteks Eclipse G360A", type: "Case", price: 140 }

  ];

  return data.map(c =>
    new ComponentModel(c.name, c.type, c.price)
  );
}}