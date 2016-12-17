//Require mongoose
var mongoose = require("mongoose");
//Create a schema class
var Schema = mongoose.Schema;

//Create Comments schema
var CommentsSchema = new Schema({
	title: {
		type:String
	},
	body: {
		type:String
	}
});


// Remember, Mongoose will automatically save the ObjectIds of the Comments
// These ids are referred to in the Technews model

// Create the Note model with the NoteSchema
var Comments = mongoose.model("Comments", CommentsSchema);

// Export the Note model
module.exports = Comments;
