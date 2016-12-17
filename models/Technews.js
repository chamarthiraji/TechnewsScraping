//Require mongoose
var mongoose = require("mongoose");
//Create Schema class
var Schema = mongoose.Schema;

//Create Technews schema
var TechnewsSchema = new Schema({

	title: {
		type:String,
		required: true
	},
	titleLink: {
		type:String,
		required: true
	},
	imageLink: {
		type:String,
		required: true
	},
	teaser: {
		type: String,
		required:true
	},
 // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Comments"
  }




});

// Create the Article model with the ArticleSchema
var Technews = mongoose.model("Technews", TechnewsSchema);

// Export the model
module.exports = Technews;
