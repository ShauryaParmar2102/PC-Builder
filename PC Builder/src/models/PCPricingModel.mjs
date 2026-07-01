export class PCPricingModel {

  constructor(data) {
    this.cpuBase = data.cpuBase;
    this.gpuBase = data.gpuBase;
    this.ramBase = data.ramBase;
    this.storageBase = data.storageBase;
    this.extras = data.extras;
  }

  static async getPricing() {
    //Raw Data
    const data = {
      cpuBase: 200,
      gpuBase: 500,
      ramBase: 80,
      storageBase: 60,

       extras: [
        { name: "RGB Lighting", price: 50 },
        { name: "Liquid Cooling", price: 150 },
        { name: "Extra Case Fans", price: 30 }
       ]
    };

    return new PCPricingModel(data);
  }

    static async getExtraPrice(extraName) {
      const pricing = await PCPricingModel.getPricing();
      const extra = PCPricingModel.extras.find(e => e.name === extraName); // Map raw extra objects into ExtraItem instances
      return extra ? extra.price : 0;
    }
  }

