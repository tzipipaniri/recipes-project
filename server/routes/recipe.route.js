const express = require("express");
const { getAllRecipes, getRecipeById, addRecipe, updateRecipe, deleteRecipe, getRecipesWithUsers, getRecipesByUser, getRecipesByUserId, getRecipesByPreparationTime } = require("../controllers/recipe.controller");
const { auth } = require("../middlewares/auth");
const { getAllCategoriesWithRecipes } = require("../controllers/category.controller");
const { upload } = require("../middlewares/uploadFile");

const router = express.Router();


router.get("/", getAllRecipes);
router.get("/with-users", getAllCategoriesWithRecipes);
router.get("/:id", getRecipeById);
router.get("/userId/:userId",getRecipesByUserId );
router.get("/time/:preparationTime",getRecipesByPreparationTime );
router.post("/",auth,upload.single('img'),addRecipe);
router.put("/:id", upload.single('img'),updateRecipe);
router.delete("/:id", deleteRecipe);

module.exports = router;
