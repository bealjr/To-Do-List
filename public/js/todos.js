//Check off specific To dos by clicking
"use strict";

var buttonAddTask = document.getElementById("buttonAddTask")


//ACTIVATE THE SUBMIT BUTTON FOR ADDING A NEW LIST OR NEW TASK IN THE DATABASE ROUTER.POST
$("input[type = 'text']").keypress(function(){
	if(event.which === 13 && $(this).text().trim().lenght > 0){
		clickInputInsert(buttonAddTask);
	}
});

$(window).on('load', function() {
	//CROSS OVER THE TASKS THAT ARE COMPLETED ON THE LOAD OF THE PAGE ROUTER.PUT
	$(".spanCompletedTask").each(function( index ) {
		if ($(this).text() === 'true') {
			$(this).parent().addClass("completed");
		}
	});
});

//TOGGLE BETWEEN COMPLETE AND INCOMPLETE TASK BY CROSSING IT OVER ROUTER.PUT
$("#sectionNewList ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

//ACTIVATE THE SUBMIT BUTTON FOR REMOVING A TASK IN THE DATABASE ROUTER.DELETE
$("ul").on("click", "span", function(event){
	clickInputInsert($(this).parent().children(".hiddenTasks").children("button"));
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	event.stopPropagation();
});

//FADE PLUS ICON ON CLICK
$(".fa-plus").click(function(){
	$("#inputAddToDo").fadeToggle();
});


//FUNCTIONS
//ACTIVATE INPUT TYPE=FILE TAGS BY CLICKING AT DIFFERENT BUTTONS
function clickInputInsert(inputTag){
  inputTag.click();
}
