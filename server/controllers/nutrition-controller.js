const dt = require("../foods.json");

const findCombination = (foods, calorieNeeds, proteinGoal, limit) => {
  let currentCalories = 0;
  let currentProtein = 0;
  let currentFat = 0;
  const selectedFoods = [];
  const remainingFoods = [];

  const sortedFoods = [...foods].sort((a, b) => {
    const caloriesA = a.calories;
    const caloriesB = b.calories;
    return caloriesA - caloriesB;
  });

  // Fisher-Yates (Knuth) shuffle algorithm
  for (let i = sortedFoods.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sortedFoods[i], sortedFoods[j]] = [sortedFoods[j], sortedFoods[i]];
  }

  for (const food of sortedFoods) {
    if (currentProtein < proteinGoal) {
      if (
        currentCalories + food.calories <= calorieNeeds &&
        currentProtein + food.protein <= proteinGoal
      ) {
        selectedFoods.push(food);
        currentCalories += food.calories;
        currentProtein += food.protein;
        currentFat += food.fat;
      } else {
        remainingFoods.push(food);
      }
    } else {
      if (
        currentCalories + food.calories <= calorieNeeds &&
        selectedFoods.length < limit
      ) {
        selectedFoods.push(food);
        currentCalories += food.calories;
        currentFat += food.fat;
      }
    }
  }

  // Fill the remaining slots with other foods
  for (const food of remainingFoods) {
    if (
      currentCalories + food.calories <= calorieNeeds &&
      selectedFoods.length < limit
    ) {
      selectedFoods.push(food);
      currentCalories += food.calories;
      currentFat += food.fat;
    }
  }

  return selectedFoods;
};

exports.getNutritionData = (req, res) => {
  console.log("Fetching all nutrition data...");
  res.json(dt);
};

exports.getBulkingFoods = (req, res) => {
  const weight = parseFloat(req.query.weight);
  const height = parseFloat(req.query.height);
  const age = parseInt(req.query.age);
  const gender = req.query.gender.toLowerCase();

  let BMR;
  if (gender === "male") {
    BMR = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
  } else if (gender === "female") {
    BMR = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
  } else {
    return res.status(400).json({ error: "Invalid gender" });
  }

  const calorieNeeds = (BMR * 1.55) + 500;
  const proteinGoal = weight * 2;
  const bulkingFoods = findCombination(dt, calorieNeeds, proteinGoal, 10);

  console.log(`Found ${bulkingFoods.length} foods for bulking`);

  res.json({
    calorieNeeds,
    proteinGoal,
    foods: bulkingFoods,
  });
};

exports.getCuttingFoods = (req, res) => {
  const weight = parseFloat(req.query.weight);
  const height = parseFloat(req.query.height);
  const age = parseInt(req.query.age);
  const gender = req.query.gender.toLowerCase();

  let BMR;
  if (gender === "male") {
    BMR = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
  } else if (gender === "female") {
    BMR = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
  } else {
    return res.status(400).json({ error: "Invalid gender" });
  }

  const calorieNeeds = (BMR * 1.55) - 500;
  const proteinGoal = weight * 2;
  const cuttingFoods = findCombination(dt, calorieNeeds, proteinGoal, 10);

  console.log(`Found ${cuttingFoods.length} foods for cutting`);

  res.json({
    calorieNeeds,
    proteinGoal,
    foods: cuttingFoods,
  });
};
