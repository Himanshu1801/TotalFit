const router = require("express").Router();

const {
  getNutritionData,
  getBulkingFoods,
  getCuttingFoods,
} = require("../../controllers/nutrition-controller");

// /api/nutrition-data to get all nutrition data
router.route("/nutrition-data").get(getNutritionData);

// /api/bulking-foods to get bulking food suggestions
router.route("/bulking-foods").get(getBulkingFoods);

// /api/cutting-foods to get cutting food suggestions
router.route("/cutting-foods").get(getCuttingFoods);

module.exports = router;
