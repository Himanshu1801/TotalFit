const router = require("express").Router();
const userRoutes = require("./user-routes");
const exerciseRoutes = require("./exercise-routes");
const nutritionRoutes = require("./nutrition-routes");
const photoRoutes = require("./photo-routes");

router.use("/user", userRoutes);
router.use("/exercise", exerciseRoutes);
router.use("/nutrition", nutritionRoutes);
router.use("/gallery", photoRoutes);

module.exports = router;
