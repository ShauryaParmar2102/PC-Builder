import { ComponentModel } from "../models/ComponentModel.mjs";

export default class ComponentController {

  static async PClist(req, res) {
    try {
      const components = await ComponentModel.getAll();

      // Do something with components here
      res.status(200).json(components);

    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to render Component list");
    }
  }

  static async getComponentListJSON(req, res) {
    try {
      const components = await ComponentModel.getAll();

      res.status(200).json(components);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch components" });
    }
  }
}