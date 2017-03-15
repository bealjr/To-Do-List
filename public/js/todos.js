//Check off specific To dos by clicking
"use strict";

$("ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

$("ul").on("click", "span", function(event){
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	event.stopPropagation();
});

$("input[type = 'text']").keypress(function(){
	if(event.which === 13){
		 let todoText = $(this).val();
		 $(this).val("");
		 $("#sectionNewList ul").append("<li><span><i class= 'fa fa-trash'></i></span>" + todoText + "</li>");
	}
});

$(".fa-plus").click(function(){
	$("input[type = 'text']").fadeToggle();
});
