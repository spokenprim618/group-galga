// ===========================
// PERMISSION REQUIRED TO MODIFY BELOW
// This file controls player resistance logic.
// Consequences: Changing this may break all damage calculations, resistances, or game balance.
// All changes must be reviewed before merging.
// ===========================
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
