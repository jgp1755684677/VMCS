var height1 = document.getElementById("page-content").offsetHeight;
var height2 = document.getElementById("page-header").offsetHeight;
var height3 = document.getElementById("footer").offsetHeight;
var height = height1 - height2 - height3;
document.getElementById("mapDiv").style.height = height + "px";
$("#page-content").resize(function() {
	var height1 = document.getElementById("page-content").offsetHeight;
	var height = height1 - height2 - height3;
	document.getElementById("mapDiv").style.height = height + "px";
});
