export class PCListModel {

    static STORAGE_KEY = "PCs";

    static getAll() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    static saveAll(PCs) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(PCs));
  }

  static add(PC) {
    PC.id = Date.now().toString(); // Creates a unique ID using current time
    const PCs = this.getAll(); //Gets existing PCs and adds new one
    PCs.push(PC);
    this.saveAll(PCs); // Saves updated list back to storage
  }

    static getById(id) {
    return this.getAll().find(p => p.id === id); // Gets all houses and finds the one with matching ID
  }

  static delete(id) {
    const PCs = this.getAll().filter(p => p.id !== id);
    this.saveAll(PCs);
  }

}