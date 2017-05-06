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
		currTab.style.zIndex = "0";
	}

	var tabToChange = document.getElementById(newTab+"Tab");
	var boxToChange = document.getElementById(newTab+"Tools");

	boxToChange.style.display = "flex";
	tabToChange.style.zIndex = "2";
}

/*-----------------
Menu Slider 
-----------------*/
$(document).ready(function(){
	$(".toggleMenuButton").click(function(){
		$(".innerMenuContainer").animate({width: 'toggle'});
	});

	// this too should be fixed
	// $(".toolTab").mouseenter(function(){
	// 	if (this.id !== currentToolBox+"Tab") {
	// 		if (this.id == "vertexTab") { document.getElementById(this.id).style.backgroundColor = "#238db2"; }
	// 		if (this.id == "edgeTab") { document.getElementById(this.id).style.backgroundColor = "#993a43"; }
	// 		if (this.id == "graphTab") { document.getElementById(this.id).style.backgroundColor = "#41773a"; }
	// 	}
	// });
	// $(".toolTab").mouseleave(function(){
	// 	if (this.id !== currentToolBox+"Tab") {
	// 		if (this.id == "vertexTab") { document.getElementById(this.id).style.backgroundColor = "#30BCED"; }
	// 		if (this.id == "edgeTab") { document.getElementById(this.id).style.backgroundColor = "#DB5461"; }
	// 		if (this.id == "graphTab") { document.getElementById(this.id).style.backgroundColor = "#5FAD56"; }
	// 	}
	// });
});