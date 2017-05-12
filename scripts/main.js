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
	curColour = "#FF383F", //what colour is in the input box
	currEdge = {		//starting position of current animated edge
		x: -1,
		y: -1
	};

window.onload = function(){
	canvas = document.getElementById("mainCanvas");
	c = canvas.getContext("2d");
	canvas.addEventListener("mousedown", onClick, false);
	canvas.addEventListener("mouseup", endClick, false);
	canvas.setAttribute("height",window.innerHeight);
	canvas.setAttribute("width",window.innerWidth);
	clearCanvas();

	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-98672458-1', 'auto');
	  ga('send', 'pageview');
};
