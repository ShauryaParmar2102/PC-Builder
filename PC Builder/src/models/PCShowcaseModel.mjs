let posts = [];

export class PCShowcaseModel {

  // 🔹 Get all showcase builds
  static getAll() {
    return posts;
  }

  // 🔹 Create (alias for add — fixes your controller issue)
  static create(post) {
    return this.add(post);
  }

  // 🔹 Add new build
  static add(post) {
    const newPost = {
      ...post,
      id: post.id || `sc_${Date.now()}`
    };

    posts.push(newPost);
    return newPost;
  }

  //  Get single build
  static getById(id) {
    return posts.find(p => p.id === id);
  }

  //  Delete build
  static delete(id) {
    posts = posts.filter(p => p.id !== id);
  }

  //  Optional: update build (useful later)
  static update(id, updatedData) {
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      ...updatedData,
      id
    };

    return posts[index];
  }
}