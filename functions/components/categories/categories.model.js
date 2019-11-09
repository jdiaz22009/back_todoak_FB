'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose


//categorie
const CategorieSchema = new Schema({
    nameCategory: { type: String, default: '' },
    id_subcategory: { type: Schema.Types.ObjectId, ref: 'subcategories' },
    desc: { type: String, default: '' },
    create_at: { type: String, default: '' },
    updated_at: { type: String, default: '' }
})

// subCategorie
const SubCategorieSchema = new Schema({
    id_category: { type: Schema.Types.ObjectId, ref: 'categorys' },
    SubCategorie: [{
        name: { type: String },
        desc: { type: String }
    }],
    isActive: { type: Boolean, default: true },
    create_at: { type: String, default: '' },
    updated_at: { type: String, default: '' }
});

var categorieSchema = mongoose.model('categorys', CategorieSchema)
var subCategorieSchema = mongoose.model('subcategories', SubCategorieSchema)
module.exports.categorieSchema = categorieSchema
module.exports.subCategorieSchema = subCategorieSchema
