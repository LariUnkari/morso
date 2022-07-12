class GridMemory {
  constructor() {
    this.memory = {};
  }

  clear() {
    for (let id of this.getKeys()) {
      this.removeEntry(id);
    }
  }

  setEntry(id, coordinate, time, value) {
    this.memory[id] = { coordinate, time, value };
  }

  getEntry(id) {
    return this.memory[id];
  }

  hasEntry(id) {
    return this.memory[id] !== undefined;
  }

  removeEntry(id) {
    delete this.memory[id];
  }

  getKeys() {
    return Object.keys(this.memory);
  }
}

export { GridMemory };
