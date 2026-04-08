const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator").default;
const connexionschema = new mongoose.Schema({

    
    email: { type : String, required: true, unique: true },
    code: { type : String, required: true },

    profilCree : { 
        type: Boolean,
        default: false,
    }

})
connexionschema.plugin(uniqueValidator)
module.exports = mongoose.model("Connexion", connexionschema)