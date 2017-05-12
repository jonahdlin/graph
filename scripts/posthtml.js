/*-----------------
Button Shape
-----------------*/
var sq_h = $('.toolButton').height();
$('.squareButton').css({
    'width': sq_h + 'px'
});

var twoone_h = $('.toolButton').height();
$('.twooneButton').css({
    'width': 2*twoone_h + 'px'
});

var threeone_h = $('.toolButton').height();
$('.threeoneButton').css({
    'width': 3*threeone_h + 'px'
});

$(document).ready(function(){
	$(".toolButton").click(function(){
		$(".toolButton").not(this).css("border", "1px solid black");
		$(".toolButton").not(this).css("border-radius", "0px");
		this.style.border = "3px solid black"
		this.style.borderRadius = "3px"
	});
});