const { buildWeekPlan, createEmptyTodayPlan } = require("./domain");

const STATE_VERSION = 5;

function createInitialState() {
  return {
    version: STATE_VERSION,
    recipes: [],
    inventory: [],
    groceries: [],
    todayPlan: createEmptyTodayPlan(),
    weekPlan: buildWeekPlan([])
  };
}

module.exports = { createInitialState, STATE_VERSION };
