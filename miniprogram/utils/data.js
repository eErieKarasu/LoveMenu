const { buildWeekPlan } = require("./domain");

const STATE_VERSION = 3;

function createInitialState() {
  return {
    version: STATE_VERSION,
    recipes: [],
    groceries: [],
    selectedToday: [],
    weekPlan: buildWeekPlan([])
  };
}

module.exports = { createInitialState, STATE_VERSION };
