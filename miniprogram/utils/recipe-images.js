const RECIPE_IMAGES = [
  { pattern: /(番茄|西红柿).*(蛋)|(蛋).*(番茄|西红柿)/, path: "/assets/images/dish-tomato-eggs-20260820.jpg" },
  { pattern: /(青椒).*(土豆丝)|(土豆丝).*(青椒)/, path: "/assets/images/dish-green-pepper-potato-20260820.jpg" },
  { pattern: /(玉米).*(排骨).*(汤)|(排骨).*(玉米).*(汤)/, path: "/assets/images/dish-corn-rib-soup-20260820.jpg" }
];

function imageForRecipe(recipe) {
  const matched = RECIPE_IMAGES.find((item) => item.pattern.test(recipe && recipe.name || ""));
  return matched ? matched.path : "";
}

module.exports = { imageForRecipe };
