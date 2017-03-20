//Check off specific To dos by clicking
"use strict";

var buttonAddTask = document.getElementById("buttonAddTask")


//ACTIVATE THE SUBMIT BUTTON FOR ADDING A NEW LIST OR NEW TASK IN THE DATABASE ROUTER.POST
$("input[type = 'text']").keypress(function(){
	if(event.which === 13 && $(this).text().trim().length > 0){
		clickInputInsert(buttonAddTask);
	}
});

$(window).on('load', function() {
	//CROSS OVER THE TASKS THAT ARE COMPLETED ON THE LOAD OF THE PAGE ROUTER.PUT
	$(".spanCompletedTask").each(function( index ) {
		console.log($(this));
		if ($(this).text() === 'true') {
			console.log($(this).text());
			$(this).parent().addClass("completed");
		}
	});
});

//TOGGLE BETWEEN COMPLETE AND INCOMPLETE TASK BY CROSSING IT OVER ROUTER.PUT
$("#sectionNewList ul").on("click", ".span-check", function(){
	$(this).toggleClass("completed");
	console.log($(this).children('.hiddenTasksUpdate').children('button'));
	console.log($(this));
	// clickInputInsert($(this).children('.hiddenTasksUpdate').children('button'));
	event.stopPropagation();
});

//ACTIVATE THE SUBMIT BUTTON FOR REMOVING A LIST IN THE DATABASE ROUTER.DELETE
$("ul").on("click", ".span-trash", function(event){
	clickInputInsert($(this).parent().children(".formDeleteList").children(".buttonDeleteList"));
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	event.stopPropagation();
});


//ACTIVATE THE SUBMIT BUTTON FOR REMOVING A TASK IN THE DATABASE ROUTER.DELETE
$(".span-trash").on("click", function () {
	console.log($(this).parent().children(".hiddenTasksDelete").children("button"));
	clickInputInsert($(this).parent().children(".hiddenTasksDelete").children("button"))
})


//UPDATE THE COMPLETED TASK
$(".divForButton").on("click", function () {
	console.log($(this).parent().children(".hiddenTasksUpdate").children('button'));
	clickInputInsert($(this).parent().children(".hiddenTasksUpdate").children('button'))
})

//POP UP THE PROMPT FOR THE USER TO EDIT THE NAME OF THE LIST
$(".span-pencil").on('click', function () {
	var editThis = $(this).parent().children(".formEditListName").children('.inputEditListName');
	var anchorText = $(this).parent().children("a");
	var buttonUpdate = $(this).parent().children('.formEditListName').children('button');
	runEditPrompt(anchorText, editThis, buttonUpdate);
})

//FADE PLUS ICON ON CLICK
$(".fa-plus").click(function(){
	$("#inputAddToDo").fadeToggle();
});


//FUNCTIONS
//ACTIVATE INPUT TYPE=FILE TAGS BY CLICKING AT DIFFERENT BUTTONS
function clickInputInsert(inputTag){
  inputTag.click();
}

//PROMPT FOR CHANGING THE VALUE OF THE LIST AND ACTIVATING SUBMIT BUTTON
function runEditPrompt(listTextValue, inputEditListName, buttonUpdate) {
	var newListName = prompt('Update the list\'s name', listTextValue.text());
	if (newListName.trim() !== "" || newListName.trim() !== listTextValue.text()) {
		inputEditListName.attr('value', newListName);
		listTextValue.text(newListName);

		clickInputInsert(buttonUpdate);


	}
}
