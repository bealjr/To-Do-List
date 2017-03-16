//Check off specific To dos by clicking
"use strict";

var buttonAddTask = document.getElementById("buttonAddTask")

$(window).on('load', function() {
	$( ".spanCompletedTask" ).each(function( index ) {
		if ($( this ).text() === 'true') {
			$(this).parent().addClass("completed");
		}
	});
});

$("#sectionNewList ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

$("ul").on("click", "span", function(event){
	clickInputInsert($(this).parent().children(".hiddenTasks").children("button"));
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	event.stopPropagation();
});

// $("input[type = 'text']").keypress(function(){
// 	if(event.which === 13){
// 		 let todoText = $(this).val();
// 		 $(this).val("");
// 		 $(".sectionLists ul").append("<li><span><i class= 'fa fa-trash'></i></span>" + todoText + "</li>");
// 	}
// });


//Submit button for adding a new task
$("input[type = 'text']").keypress(function(){
	if(event.which === 13){
	clickInputInsert(buttonAddTask);
	}
});

$(".fa-plus").click(function(){
	$("#inputAddToDo").fadeToggle();
});


//ACTIVATE INPUT TYPE=FILE TAGS BY CLICKING AT DIFFERENT BUTTONS
function clickInputInsert(inputTag){
  inputTag.click();
}
