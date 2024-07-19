const mongoose = require('mongoose');
const { Recipe } = require('./recipe.model');

const recipeSchema=new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    name:String,
    image:String
})

const categorySchema = new mongoose.Schema({
    description: { type: String, required: true },
    recipes: {
        type: [recipeSchema],
        // type: [{_id:mongoose.Types.ObjectId,name:String,image:String}],
        // validate: {
        //     validator(v) {
        //         return v && v.length <= 3;
        //     },
        //     message: 'must have most 3 recipes'
        // }
    },
})

module.exports.Category = mongoose.model('categories', categorySchema);