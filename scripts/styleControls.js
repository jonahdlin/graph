/*-----------------
Tool Box Swtiching
-----------------*/
var currentToolBox = "vertex";

// changes the currently selected tool box to newTab and fixes all the styles
function toolBoxChange(newTab) {
	if (currentToolBox == newTab) return;
	currentToolBox = newTab;

	var tools = ["vertex", "edge", "graph"];
	tools.splice(tools.indexOf(newTab), 1);

	for (var i = 0; i <= 1; i++) {
		var currTab = document.getElementById(tools[i]+"Tab");
		var currBox = document.getElementById(tools[i]+"Tools");
		currBox.style.display = "none";
	}

	var tabToChange = document.getElementById(newTab+"Tab");
	var boxToChange = document.getElementById(newTab+"Tools");

	boxToChange.style.display = "flex";
}

$(document).ready(function(){
	$(".toggleMenuButton").click(function(){
		$(".innerMenuContainer").animate({width: 'toggle'});
	});
});