// Function draw called from index.html
function draw() {
    "use strict";
	
	// Define Constant for the page
    var margin = 75,
		width = 1300 - margin,
        height = 600 - margin;

	// Main title
	d3.select("body")
		.append("h2")
		.text("Prosper Loans is a rapidly growing bussiness in the United State of America")
	
	// Division of the page in order to get a nice positioning of the graph
	var main_div=d3.select("body").append("div").attr("class","main_div").style('display', 'flex')
	var left_div=main_div.append("div").attr("class","left_div").style("width",width/2 + margin/2)
	var right_div=main_div.append("div").attr("class","right_div").style("width",width/2 + margin/2 )
	var right_top_div=right_div.append("div").attr("class","right_top_div")
	var right_bottom_div=right_div.append("div").attr("class","right_bottom_div").style("width",width/2 + margin/2 )
	var last_div=d3.select("body").append("div").attr("class","last_div")
	
	// Creation of the svg for the line graph
	left_div.append("p").attr("class","title_line_graph").text("Total Amount of Money Borrowed")
	var svg_line=left_div
        .append("svg")
        .attr("width", width/2 + margin/2)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'chart');
		
	// Creation of the svg for the map
	right_top_div.append("p").attr("class","title_map_graph").text("Amount Borrowed per State")
	var svg = right_top_div
        .append("svg")
        .attr("width", width/2 + margin/2)
        .attr("height", 3./4. *height + margin/2.)
        .append('g')
        .attr('class', 'map');
	
	svg.append("rect")
		.attr('x',width/4)
		.attr('y',0.1*height/4)
		.attr("width", 20)
        .attr("height", 10)
		.style("fill","rgb(9,157,217)")
		.style("stroke","black");
		
	svg.append("text")
		.attr('x',width/4+25)
		.attr('y',0.1*height/4+10)
		.attr("width", 20)
        .attr("height", 10)
		//.style("fill","rgb(9,157,217)")
		//.style("stroke","black")
		.text("State with available data");
		
	svg.append("rect")
		.attr('x',width/4)
		.attr('y',0.1*height/4+20)
		.attr("width", 20)
        .attr("height", 10)
		.style("fill","white")
		.style("stroke","black");
	
	svg.append("text")
		.attr('x',width/4+25)
		.attr('y',0.1*height/4+30)
		.attr("width", 20)
        .attr("height", 10)
		//.style("fill","rgb(9,157,217)")
		//.style("stroke","black")
		.text("State without available data");
	
	// Add explanation paragraph
	right_bottom_div.append("p").attr("class","main_explanation").html("Prosper Marketplace, Inc. is a San Francisco, California-based company \
		in the peer-to-peer lending industry. <BR> The current visualization shows the quick bussiness increase of the concept between 2005 and 2014")
	
	right_bottom_div.append("p").attr("class","user_message").html("<br> <br> Please Wait until initial animation is finished")
	
	// Add explanation paragraph
	last_div.append("p").attr("class","last_div").html("Source: <a href='https://docs.google.com/document/d/1w7KhqotVi5eoKE3I_AZHbsxdr-NmcWsLTIiZrpxWx4w/pub?embedded=true'>Loan Data from Prosper</a> <br> By Julien Delbove")
	
	// Function to plot the line graph
	function plot_line_graph(data){
		
		var myChart = new dimple.chart(svg_line, data);
		var x = myChart.addTimeAxis("x", "year"); 
		x.title = "Years"
        var y = myChart.addMeasureAxis("y", "total_loan");
		y.title = "Total Amount Borrowed"
		x.dateParseFormat="%Y";
		x.tickFormat="%Y";
		myChart.addSeries(null, dimple.plot.line);
		myChart.addSeries(null, dimple.plot.scatter); 
        myChart.draw();
	}
	
	// Function to add the points on the USA map
	function plot_points(data){
		
		// aggregation function per year
		function agg_years(leaves) {
			var total=d3.sum(leaves,function(d) {return d['LoanOriginalAmount'];});
			
			return {
				'Number': leaves.length,
				'Total_Borrowed':total,
				};
		};
		
		// Agglomeration of the Proper Loan data per year and per state			
		var nested=d3.nest()
			.key(function(d){
				if (d['date']===null){
					return 0;
				}
				else {
					return d['date'].getUTCFullYear();
				}
			})
			.key(function(d){
				return d['BorrowerState'];
			})
			.rollup(agg_years)
			.entries(data);
				
		// Agglomeration of Prosper Loan data per year
		var nested_year=d3.nest()
			.key(function(d){
				if (d['date']===null){
					return 0;
				}
				else {
					return d['date'].getUTCFullYear();
				}
			})
			.rollup(agg_years)
			.entries(data);
		
		// Filter data with bad information on year (0)
		var nested_year_2 = nested_year.filter(function(d) {
			if (d.key==="0"){
				return false;
			}
			else {
				return true;
			}
		}).map(function(d) {
			return {
				year: d.key,
				total_loan: d.values.Total_Borrowed
			}
		});
		
		// Call to the function that will create the line graph
		plot_line_graph(nested_year_2)
		
		// Get the max of the Total Amount Borrowed for all the states and all the year to scale 
		// the radius of the points on the map
		var Total_Borrowed_max=d3.max(nested,function(d){
				var v1=d.values
				return d3.max(v1,function(k){return k.values['Total_Borrowed']});
		})
		
		// Scaling function for the point radius
		var radius=d3.scale.sqrt()
					.domain([0,+Total_Borrowed_max])
					.range([0,20]);
		
		// Function to update the graph depending on the year
		function update(year){
			
			left_div.select("p.title_line_graph").text("Total Amount of Money Borrowed in "+year)
			right_top_div.select("p.title_map_graph").text("Amount Borrowed per State in "+year)
			
			// Filtering of the data for the current year
			var filtered=nested.filter(function(d){
				return new Date(d['key']).getUTCFullYear() === year;
				});
			
			// Creation of a list of the state for which data are available for the current year
			var countries=filtered[0];
			var states=d3.set();
			countries.values.forEach(function(d){
					states.add(d.key);
				});

			// Function to update the color of the state depending whether there is data or not for the current year
			function update_countries(d){	
				if (states.values().indexOf(d.properties.abbr) !== -1){
					return "rgb(9,157,217)";
				}
				else {
					return "white";
				}
				
			}

			// Update the color of the state
			svg.selectAll("path")
					.transition()
					.duration(500)
					.style("fill",update_countries);

			// Function to update the radius depending on the amount borrowed in each state for the current year
			function update_radius(d){	
				if (states.values().indexOf(d.properties.abbr) !== -1){
					var curr_state=d.properties.abbr
					var filtered_l2=filtered[0].values.filter(function(d){
						
						return d.key === curr_state;
					});
					var rad=radius(+filtered_l2[0].values["Total_Borrowed"])
					return rad;
				}
				else {
					return 0.;
				}
			}

			// Update the radius of the state
			svg.selectAll("circle")
					.transition()
					.duration(500)
					.attr("r",update_radius)
					
			// Update the color of the cicle on the line graph for the current year
			svg_line.selectAll("circle.dimple-series-1").filter(function(d){
				if (d.key.indexOf(year) !=-1 ){
					return true
				}
				else {
					return false
				}
			})
			.transition()
			.duration(500)
			.style("fill","red")
			
			// Set the color of all circle for the years different than the current year at the default value
			svg_line.selectAll("circle.dimple-series-1").filter(function(d){
				if (d.key.indexOf(year) !=-1 ){
					return false
				}
				else {
					return true
				}
			})
			.transition()
			.duration(500)
			.style("fill","#80B1D3")
			
		};
		
		// Initial annimation for the author-driven narrative
		var years=[];
		for(var year = 2005; year <= 2014; year += 1) {
            years.push(year);
		}
		
		var year_idx=0;
		
		var year_interval=setInterval(function(){
			update(years[year_idx]);
			year_idx++;
		
			if (years[year_idx] === 2009){
				var year_img=[];
				year_img.push("2008");
				
				var mainBox=svg_line.append("rect").attr({
				id: "crisis_rect",
				x: 0.4*width/2,
				y: 0.7*height,
				width: 115,
				height: 40,
				fill: "#D7FFEC" ,
				opacity: 0.8});
				
				svg_line.append("text").text("Subprime Crisis")
				.attr({
				id: "crisis",
				x: 0.41*width/2,
				y: 0.75*height,
				width: 100,
				height: 50})
				.style('fill','red');	
			}
				
		
			if (year_idx>=years.length) {
				clearInterval(year_interval);
				
				right_bottom_div.select("p.user_message").text("Click on Line Chart circles to display previous year information")
				
				svg_line.selectAll("circle").on("click", function(d) {			
					var curr_year=new Date(d.cx).getUTCFullYear();
					curr_year=curr_year+1
					update(curr_year);
				});
					
			}
		
		},1000);

	}
	
	// Function to draw the initial map of the united state
	function draw_States(state_data){
	
		// D3 Projection
		var projection = d3.geo.albersUsa()
			.translate([width/4, 3./4.*height/2 ])    // translate to center of screen
			.scale([700]);          // scale things down so see entire US
        
		// Define path generator
		var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	.projection(projection);  // tell path generator to use albersUsa projection
		
		var map=svg.selectAll("path")
			.data(state_data.features)
			.enter()
			.append("path")
			.attr("d",path)
			.style("fill","white")
			.style("stroke","black")
			.style("stroke_width",0.5);
		
		// Get state center position in x from csv data
		function get_cx(state_features) {
			var pos=projection([+state_features.properties.lon,+state_features.properties.lat]);
			return pos[0];
		}
		
		// Get state center position in y from csv data
		function get_cy(state_features) {
			var pos=projection([+state_features.properties.lon,+state_features.properties.lat]);
			return pos[1];
		}
		
		// Add circle to the map graph the zero radius
		var circles=svg.append('g')
			.attr('class','bubble')
			.selectAll('circle')
			.data(state_data.features)
			.enter()
			.append('circle')
			.attr("cx",get_cx)
			.attr("cy",get_cy)
			.attr("r",0.);
		
		// Date format in the Prosper Loan data
		var format=d3.time.format("%Y-%m-%d %H:%M:%S.%L000000");
	
		// Read Proper Loan data and draw the graph
		d3.csv("/data/prosperLoanData.csv",function(d) { 
				d['date']=format.parse(d['ListingCreationDate']);
				return d;
			},plot_points);
	}
	
	// Read the states json file and draw the states map
	d3.json("/data/gz_2010_us_040_00_20m.json", draw_States)

}

