const express = require("express");
const { getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory, getAllCategoriesWithUsers, getAllCategoriesWithRecipes} = require("../controllers/category.controller");
const { auth } = require("../middlewares/auth");

const router = express.Router();


router.get("/", getAllCategories);
router.get("/categories/withRecipes", getAllCategoriesWithRecipes);
router.get("/:id", getCategoryById);
router.post("/", auth, addCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
