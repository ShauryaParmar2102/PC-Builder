import  { PCPricingModel } from "../models/PCPricingModel.mjs";

export class PCPricingController {

    static async getPCPricing(req,res) {
        try {
            const pricing = await PCPricingModel.getPricing();
            res.status(200).json(pricing);
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch PC pricing" });
        }
    }

    static async getExtraPrice(req,res) {

        try {
            const extraName = req.params.extraName;
        const price = await PCPricingModel.getExtraPrice(extraName);
              res.status(200).json({ extra: extraName, price }); 
        } catch (err) {
            console.error(err); 
     res.status(500).json({ error: "Failed to fetch extra price" }); 
        }
    }

}