class PlayerResistances {
  constructor() {
    this.resistances = {
      fire: 0,
      ice: 0,
      toxic: 0,
      dark: 0,
    };
  }

  setResistance(type, value) {
    if (this.resistances.hasOwnProperty(type)) {
      this.resistances[type] = value;
    }
  }

  getResistance(type) {
    return this.resistances[type] || 0;
  }
}
