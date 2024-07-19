const mongoose = require('mongoose')
const { Category } = require("../models/category.model");

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().select('-recipes -__v');
        return res.json(categories);
    } catch (error) {
        next(error);
    }
};


exports.getAllCategoriesWithRecipes = async (req, res, next) => {
    try {
        const categories = await Category.find().select('-__v');
        return res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = (req, res, next) => {
    const id = req.params.id;

    console.log(mongoose.Types.ObjectId.isValid(id));
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        Category.findById(id, { __v: false })
            .then(c => {
                res.json(c);
            })
            .catch(err => {
                next({ message: 'category not found', status: 404 })
            })
    }
};

exports.getCategoriesWithRecipes = async (req, res, next) => {
    try {
        const categories = await Category.find()
            .populate('users', 'username email -_id')
            .select('-__v');
        return res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.addCategory = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            const c = new Category(req.body);
            await c.save();
            return res.status(201).json(c);
        }
        else {
            next({ message: 'only admin can add category', status: 403 })
        }
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    try {
        const c = await Category.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )
        return res.json(c);
    } catch (error) {
        next(error)
    }
};

exports.deleteCategory = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        try {
            if (!(await Category.findById(id)))
                return next({ message: 'category not found!!!', status: 404 })

            await Category.findByIdAndDelete(id)
            return res.status(204).send();
        } catch (error) {
            return next(error)
        }
    }
};
