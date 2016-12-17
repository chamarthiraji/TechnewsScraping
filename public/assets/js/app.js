$.getJSON("/technews",function(data) {
	//console.log("json data frmo app.js",data);
	for(var i = 0;i< data.length;i++) {
    console.log("note:"+data[i].note);
		$("#news").append("<div  class='newsclass  well' data-id='" + 
      data[i]._id +"'data-note='" + data[i].note + "'" + ">"+
      "<a href='"+data[i].titleLink+"'>"+ data[i].title+
      "</a>"+"<br/>"+"<img class='image' src='"+
      data[i].imageLink+ "'/>"+"<br/>"+"<p>"+data[i].teaser+"</p>"+"</div>");

		}						
});


// Whenever someone clicks a p tag
$(document).on("click", ".newsclass", function() {
  $("#edit_comments").show();
  $("#delete_comments").show();
  // Empty the notes from the note section
  $("#edit_comments").empty();
  $("#delete_comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log("inside button click");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/technews/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log("inside button ajax call");
      console.log(data);

      // The title of the article
      $("#edit_comments").append("<h2 class='title'><mark>Add your comments to: </mark>" + data.title + "</h2>");
      // A textarea to add a new note body
      $("#edit_comments").append("<textarea id='editbodyinput' name='body'></textarea>");
      $("#edit_comments").append("<div><button data-id='" + data._id + "' id='savenote'>Save Note</button></div>");
     
      var deleteButtonHtml;
      deleteButtonHtml = "<div><button data-id='" + data._id;
      if ( (data.note !== undefined) &&
           (data.note !== null) &&
           (data.note._id !== undefined) ) {
        deleteButtonHtml +="'" + "data-note='" + data.note._id;
      } 
      deleteButtonHtml += "' id='deletenote'>Delete Note</button></div>";
      // The title of the article
      $("#delete_comments").append("<h2 class='title'>" + data.title + "</h2>");
      
      $("#delete_comments").append("<textarea id='deletebodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#delete_comments").append(deleteButtonHtml);

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#deletebodyinput").val(data.note.body);
      }
    });
});




// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/technews/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#editbodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#deletebodyinput").val($("#editbodyinput").val());
  $("#editbodyinput").val("");
});


// When you click the deletenote button
$(document).on("click", "#deletenote", function() {
  // Grab the id associated with the article from the submit button
  
  var curTechnewsId = $(this).attr("data-id");
  var thisId = $("#deletenote").attr("data-note");

  console.log("thisId:"+thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/technews/"+thisId+"/delete",
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#deletebodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
     
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#deletebodyinput").val("");
});
