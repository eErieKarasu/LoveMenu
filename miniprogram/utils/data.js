const { buildWeekPlan } = require("./domain");

const STATE_VERSION = 4;

function createInitialState() {
  return {
    version: STATE_VERSION,
    recipes: [],
    inventory: [],
    groceries: [],
    selectedToday: [],
    weekPlan: buildWeekPlan([])
  };
}

module.exports = { createInitialState, STATE_VERSION };
