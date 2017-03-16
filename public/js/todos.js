//Check off specific To dos by clicking
"use strict";

var buttonAddTask = document.getElementById("buttonAddTask")

$("#sectionNewList ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

$("ul").on("click", "span", function(event){
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

$("input[type = 'text']").keypress(function(){
	if(event.which === 13){
	clickInputInsert(buttonAddTask);
	// 	 let todoText = $(this).val();
	// 	 $(this).val("");
	// 	 $(".sectionLists ul").append("<li><span><i class= 'fa fa-trash'></i></span>" + todoText + "</li>");
	}
});

$(".fa-plus").click(function(){
	$("input[type = 'text']").fadeToggle();
});


//ACTIVATE INPUT TYPE=FILE TAGS BY CLICKING AT DIFFERENT BUTTONS
function clickInputInsert(inputTag){
  inputTag.click();
}
