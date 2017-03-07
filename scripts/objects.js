/* Object Definitions */
function Node(xPos,yPos){
	this.x=xPos;
	this.y=yPos;
	this.col=vProps.fColour;
	this.name="";
	this.neighbours=[];
	this.coloring="";

	/*Slowly moving a node 
	  Usage: node.move(milliseconds,new X position, new Y position)
	  This code looks like shit and there's probably a better way of doing it*/
	this.move=function(time,xPos,yPos){
		var myself=this; //because the setInterval function changes 'this' to point to 'window'
		var frameRate=10;
		var xDisplacement=xPos-myself.x;
		var yDisplacement=yPos-myself.y;
		var tickCount=time/frameRate;
		var timer=setInterval(function(){
			myself.x+=xDisplacement/tickCount;
			myself.y+=yDisplacement/tickCount;
			refreshCanvas();
		},frameRate);
		var stopTimer=setTimeout(function(){
			clearInterval(timer);
		},time);
	}

}

function Edge(v1,v2){
	this.v1=v1;
	this.v2=v2;
}