const mongoose = require('mongoose')
const { Recipe } = require("../models/recipe.model");
const { User } = require('../models/user.model');
const { Category } = require("../models/category.model");
const fs = require('fs');

const path = `${__dirname}/uploads`.replace('\\controllers', '')

function readImageToBase64(image) {
    // בדיקה אם הנתיב לתמונה קיים
    // if (!fs.existsSync(`${path}/${image}`)) {
    //     // throw new Error(`Image path ${imagePath} does not exist.`);
    //     return ''
    // }

    // קריאת התמונה כקובץ בינארי
    const imageBuffer = fs.readFileSync(`${path}/${image}`);

    // המרת נתוני התמונה למחרוזת Base64
    const base64String = Buffer.from(imageBuffer).toString('base64');

    return 'data:image/jpeg;base64,' + base64String;
}


exports.getAllRecipes = async (req, res, next) => {
    let { search, page, perPage } = req.query;

    search ??= '';
    page ??= 1;
    perPage ??= 3;

    try {
        console.log('all recipes', await Recipe.find());
        let recipes = await Recipe.find({
            name: new RegExp(search),
            isPrivate: false // only fetch recipes where isPrivate is false
        })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select('-__v');
        for (let i = 0; i < recipes.length; i++) {
            const element = recipes[i];
            if (element.image)
                recipes[i].image = readImageToBase64(recipes[i].image)
        }

        return res.json(recipes);
    } catch (error) {
        next(error);
    }
};

exports.getRecipeById = (req, res, next) => {
    const id = req.params.id;

    console.log(mongoose.Types.ObjectId.isValid(id));
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        Recipe.findById(id, { __v: false })
            .populate('user') // Populate the 'user' field in the recipe document
            .then(r => {
                console.log('Recipe:', r);
                console.log('Associated User:', r.user);
                r.image = readImageToBase64(r.image)
                res.json(r);
            })
            .catch(err => {
                console.error('Error retrieving recipe:', err);
                next({ message: 'recipe not found', status: 404 })
            })
    }
};

exports.getRecipesByUserId = async (req, res, next) => {
    const userId = req.params.userId; // Assuming user id is passed in the request params
    console.log('userId', userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next({ message: 'userId is not valid' });
    }

    try {
        // const recipes = Recipe.find().select('-__v')

        const recipesByUserId = await Recipe.find({ user: userId }); // סינון לפי מזהה משתמש
        for (let i = 0; i < recipesByUserId.length; i++) {
            const element = recipesByUserId[i];
            element.image = readImageToBase64(element.image)
        }
        return res.json(recipesByUserId);
    } catch (error) {
        next(error);
    }
};

exports.getRecipesByPreparationTime = async (req, res) => {
    //console.log('req.query.preparationTime',req.query.preparationTime);
    //const preparationTime = req.query.preparationTime; // הנח ש"זמן הכנה מקסימלי" מגיע משאילתת URL
    const preparationTime = req.params.preparationTime
    try {
        const recipes = await Recipe.find({

            preparationTimeInMinutes: { $lte: preparationTime } // סינון לפי זמן הכנה מקסימלי
            , isPrivate: false
        });
        for (let i = 0; i < recipes.length; i++) {
            const element = recipes[i];
            element.image = readImageToBase64(element.image)
        }
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).send('שגיאה בהחזרת מתכונים');
    }
};


exports.getRecipesWithUsers = async (req, res, next) => {
    try {
        const recipes = await Recipe.find({ isPrivate: false }) // Only fetch recipes where isPrivate is false
            .populate('users', 'username email -_id') // Populate the 'users' field and select specific fields
            .select('-__v'); // Exclude the __v field

        for (let i = 0; i < recipes.length; i++) {
            const element = recipes[i];
            element.image = readImageToBase64(element.image)
        }
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
};

// exports.addRecipe = async (req, res, next) => {
//     try {
//         console.log('req.body', req.body);
//         const r = new Recipe(req.body);
//         console.log(r);
//         await r.save();
//         return res.status(201).json(r);
//     } catch (error) {
//         next(error);
//     }
// };

exports.addRecipe = async (req, res, next) => {
    // const v = recipeValidator.addAndUpdateRecipe.validate(req.body);
    // if (v.error)
    //     return next({ message: v.error.message })
    console.log('JSON.parse(req.body.layers)', JSON.parse(req.body.layers));
    console.log('JSON.parse(req.body.instructions)', JSON.parse(req.body.instructions));
    if (req.body.layers)
        req.body.layers = JSON.parse(req.body.layers)
    if (req.body.instructions)
        req.body.instructions = JSON.parse(req.body.instructions)
    if (req.body.categories)
        req.body.categories = JSON.parse(req.body.categories)
    console.log("llll");
    try {
        console.log('req.user', req.user);
        if (req.user.role === "user" || req.user.role === "admin") {
            console.log('before r', { ...req.body, user: req.user });
            const imgPath = req.file ? req.file.path : null; // הוספת נתיב התמונה
            const name = req.file ? req.file.originalname : null
            console.log('req.file', req.file);
            console.log('name image', name);
            req.body.date = new Date()
            const r = new Recipe({
                ...req.body, user: req.user.user_id,
                image: name // הוספת נתיב התמונה למסד הנתונים
            });
            console.log('r', r);
            let isExist = false;
            let foundCategory;
            for (let index = 0; index < r.categories.length; index++) {
                foundCategory = await Category.findOne({ description: r.categories[index].description });
                // if (foundCategory > 0) {
                //   isExist = true;
                //   break;
                // }

                if (!foundCategory) {
                    try {
                        const c = new Category({
                            description: r.categories[index].description, // העתקת כל התכונות
                            recipes: [{ name: r.name, image: r.image }]
                            // recipesOfCategory:[]
                        });
                        await c.save();
                    } catch (error) {
                        console.log("lll");
                    }
                }
                else {
                    console.log(foundCategory);
                    foundCategory.recipes.push({ name: r.name, image: r.image });
                    await foundCategory.save();
                }

            }
            await r.save();
            return res.status(201).json(r);
        }
        else {
            next({ message: 'only manage can or admin' });
        }
    } catch (error) {
        next(error);
    }
};

// exports.addRecipe = async (req, res, next) => {

//     const { username, password } = req.body.user;

//     const user = await User.findOne({ username })

//     if (user) {
//         bcrypt.compare(password, user.password, async(err, same) => {
//             if (err)
//                 return next(new Error(err.message));

//             if (same) {
//                  const token = generateToken(user);
//                 // user.password = "****";
//                 // return res.send({ user, token });
//                 try {
//                     console.log('req.body', req.body);
//                     req.body.user=user
//                     const r = new Recipe(req.body);
//                     console.log(r);
//                     await r.save();
//                     return res.status(201).json(r);
//                 } catch (error) {
//                     next(error);
//                 }
//             }
//             return next({ message: 'Auth Failed', status: 401 })
//         })
//     }
//     else {
//         return next({ message: 'Auth Failed', status: 401 })
//     }

// };

exports.updateRecipe = async (req, res, next) => {
    if (req.body.layers)
        req.body.layers = JSON.parse(req.body.layers)
    if (req.body.instructions)
        req.body.instructions = JSON.parse(req.body.instructions)
    if (req.body.categories)
        req.body.categories = JSON.parse(req.body.categories)
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    let foundCategory;
    let r = await Recipe.findById(new mongoose.Types.ObjectId(id));
    // let r = await Recipe.find({_id:new mongoose.Types.ObjectId(id)});
    console.log('r', r);
    console.log('req.body', req.body);
    for (let index = 0; index < req.body.categories.length; index++) {
        foundCategory = await Category.findOne({ description: req.body.categories[index].description });
        // if (foundCategory > 0) {
        //   isExist = true;
        //   break;
        // }

        if (!foundCategory) {
            try {
                const c = new Category({
                    description: req.body.categories[index].description, // העתקת כל התכונות
                    recipes: [{ name: req.body.name, image: req.body.image }]
                    // recipesOfCategory:[]
                });
                await c.save();
            } catch (error) {
                console.log("lll");
            }
        }
        else {
            console.log(foundCategory);
            foundCategory.recipes.push({ name: req.body.name, image: req.body.image });
            await foundCategory.save();
        }

    }
    const imgPath = req.file ? req.file.path : null; // הוספת נתיב התמונה
    const name = req.file ? req.file.originalname : null
    if (name) {
        req.body.image = name
    }
    else {
        req.body.image = r.image
    }
    try {
        r = await Recipe.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )
        r.data = new Date()
        return res.json(r);
    } catch (error) {
        next(error)
    }
};

// exports.deleteRecipe = async (req, res, next) => {
//     const id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         next({ message: 'id is not valid' })

//     }

//     else {
//         try {
//             const r = await Recipe.findById(id)
//             if (!r)
//                 return next({ message: 'recipe not found!!!', status: 404 })
//             for (let i = 0; i < r.categories.length; i++) {
//                 console.log('r.categories[i]', r.categories[i]);
//                 foundCategory = await Category.findOne({ description: r.categories[i].description });
//                 console.log('foundCategory', foundCategory);
//                 if (foundCategory) {
//                     if (foundCategory.recipes.length == 1) {

//                         await Category.findByIdAndDelete(foundCategory._id)
//                     }
//                     else {
//                         console.log('brfore', foundCategory.recipes);
//                         const i = foundCategory.recipes.findIndex(r1 => r1.name == r.name)
//                         console.log('i', i);
//                         foundCategory.recipes.splice(i, 1);
//                         console.log('after', foundCategory.recipes);

//                     }
//                 }
//             }
//             await Recipe.findByIdAndDelete(id)
//             return res.status(204).send();
//         } catch (error) {
//             return next(error)
//         }
//     }
// };
exports.deleteRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next({ message: 'id is not valid' })

    }

    else {
        try {
            const r = await Recipe.findById(id)
            if (!r)
                return next({ message: 'recipe not found!!!', status: 404 })
            for (let i = 0; i < r.categories.length; i++) {
                console.log('r.categories[i]', r.categories[i]);
                foundCategory = await Category.findOne({ description: r.categories[i].description });
                console.log('foundCategory', foundCategory);
                if (foundCategory) {
                    if (foundCategory.recipes.length == 1) {

                        await Category.findByIdAndDelete(foundCategory._id)
                    }
                    else {
                        console.log('brfore', foundCategory.recipes);
                        const i = foundCategory.recipes.findIndex(r1 => r1.name == r.name)
                        console.log('i', i);
                        foundCategory.recipes.splice(i, 1);
                        console.log('after', foundCategory.recipes);

                    }
                }
            }
            await Recipe.findByIdAndDelete(id)
            return res.status(204).send();
        } catch (error) {
            return next(error)
        }
    }
};
