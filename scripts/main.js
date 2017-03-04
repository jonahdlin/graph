/*-----------------
Todo
-----------------*/
/*
- Add style customizability
- Add leniency when dragging edge to tiny radius vertex
- Vertex labelling
- Prettify page (and make canvas size variable)
	- Also make edge dragging and dropping nicer
*/

/*-----------------
Initialization
-----------------*/
var canvas, 			//canvas
	c, 					//context
	curCoords = {		//mouse
		x: -1,
		y: -1
	},
	cProps = {
		colour: "#EFEFEF"
	},
	vProps = {			//vertex properties
		r: 20,
		fColour: "#FF383F",
		bColour: "black",
		bThickness: 1
	},
	eProps = {			//edge properties
		thickness: 2,
		colour: "#A9A9A9"
	},
	vtcs = [],			//set of vertices
	edges = [],			//set of edges
	dragging = false,	//is the user dragging a node?
	selected = -1,		//current selected node (-1 if nothing selected)
	edgeMaking = false,	//is the user making an edge?
	operation = "node",	//what operation is the user performing?
	currEdge = {		//starting position of current animated edge
		x: -1,
		y: -1
	};

window.onload = function(){
	canvas = document.getElementById("mainCanvas");
	c = canvas.getContext("2d");
	canvas.addEventListener("mousedown", onClick, false);
	canvas.addEventListener("mouseup", endClick, false);
	canvas.setAttribute("height",window.innerHeight*0.8);
	canvas.setAttribute("width",window.innerWidth*0.8);
	clearCanvas();
};