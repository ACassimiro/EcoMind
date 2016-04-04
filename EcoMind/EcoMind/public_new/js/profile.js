function closeOverlay() {
	$(".overlay").css("visibility", "hidden");
}

function getFansList(s) {
	$(".overlay").css("visibility", "visible");
}

jQuery(document).ready(function() {
    jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
 
        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
 
        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    });
});

window.onload = function () {
	var chart = new CanvasJS.Chart("chartContainer", {
		title:{
			text: "User evolution",
			fontSize: 20          
		},
		height: 280,
		axisY: {
			title: "Quantity",
			suffix: " Gallons",
			labelFontSize: 14,
			titleFontSize: 20      
		},
		axisX: {
			title: "Date of update",
			labelFontSize: 14,
			titleFontSize: 20
		},
		animationEnabled: true,
		data: [              
			{
				type: "spline",
				name: "Water Waste",
				dataPoints: [
			        {label: "Jan 2016" , y: 44} ,     
			        {label:"Feb 2016", y: 37} ,     
			        {label: "Mar 2016", y: 34}
			    ]
			},
			{
				type: "spline",
				name: "Electricity Waste",
				dataPoints: [
			        {label: "Jan 2016" , y: 300} ,     
			        {label:"Feb 2016", y: 230} ,     
			        {label: "Mar 2016", y: 400}
			    ]
			},
			{
				type: "spline",
				name: "Food Waste",
				dataPoints: [
			        {label: "Jan 2016" , y: 20} ,     
			        {label:"Feb 2016", y: 37} ,     
			        {label: "Mar 2016", y: 25}
			    ]
			},
			{
				type: "spline",
				name: "Trash",
				dataPoints: [
			        {label: "Jan 2016" , y: 32} ,     
			        {label:"Feb 2016", y: 39} ,     
			        {label: "Mar 2016", y: 49}
			    ]
			}

		]
	});
	chart.render();
}

$(window).on("scroll", function() {
	$("body").toggleClass("scrolled", $(window).scrollTop() > 0);
});
