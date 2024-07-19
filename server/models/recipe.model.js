const mongoose = require('mongoose');
const { boolean, bool } = require('joi');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    categories: { type: [] },
    preparationTimeInMinutes: { type: Number, min: 1, default: 10 },
    difficulty: { type: Number, min: 1, max: 5 },
    date: { type: Date },
    layers: {
        type: [{
            description: String,
            ingredients: [String]
        }]
    },
    instructions: { type: [String] },
    image: { type: String },
    isPrivate: { type: Boolean },
    user: { type: mongoose.Types.ObjectId }
  })

module.exports.Recipe = mongoose.model('recipes', recipeSchema);

 // categories: {
    //     type: [String],
    //     // validate: {
    //     //     validator(v) {
    //     //         return v && v.length <= 3;
    //     //     },
    //     //     message: 'must have most 3 categories'
    //     // }
    // },
    // categories: [{ type: mongoose.Types.ObjectId, ref: 'categories' }],
    // categories: {type:[String]},
    // user: { type: mongoose.Types.ObjectId, ref: 'users' }
  // user: { type: mongoose.Types.ObjectId, ref: 'User' }
    //user: { /*type: mongoose.Types.ObjectId, ref: 'users',*/_id:mongoose.Types.ObjectId,name:String }
