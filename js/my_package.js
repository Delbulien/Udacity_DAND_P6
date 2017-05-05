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
		.text("Prosper Loans have strongly and uniformly been impacted by the subprime mortgage crisis in the USA states");
	
	// Division of the page in order to get a nice positioning of the graph
	var main_div=d3.select("body").append("div").attr("class","main_div").style('display', 'flex');
	var left_div=main_div.append("div").attr("class","left_div").style("width",width/2 + margin/2);
	var right_div=main_div.append("div").attr("class","right_div").style("width",width/2 + margin/2 );
	var right_top_div=right_div.append("div").attr("class","right_top_div");
	var right_bottom_div=right_div.append("div").attr("class","right_bottom_div").style("width",width/2 + margin/2 );
	var last_div=d3.select("body").append("div").attr("class","last_div");
	
	// Creation of the svg for the line graph
	left_div.append("p").attr("class","title_line_graph").text("Total Amount of Money Borrowed");
	var svg_line=left_div
        .append("svg")
        .attr("width", width/2 + margin/2)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'chart');
		
	// Creation of the svg for the map
	right_top_div.append("p").attr("class","title_map_graph").text("Amount Borrowed per State");
	var svg = right_top_div
        .append("svg")
        .attr("width", width/2 + margin/2)
        .attr("height", 3./4. *height + margin/2.)
        .append('g')
        .attr('class', 'map');
	
	// Legend for circle
	svg.append('circle')
		.attr('class','bubble_leg')
		.attr("cx",width/4)
		.attr("cy",0.1*height/4)
		.attr("r",10.)
		.style("opacity", 0.5);
		
	svg.append("text")
		.attr('x',width/4+25)
		.attr('y',0.1*height/4)
		.attr("width", 20)
        .attr("height", 10)
		.text("Amount borrowed in the state");
		
	// Marker for the arrow
	svg.append("svg:defs").append("svg:marker")
			.attr({
				"id":"arrow_end",
				"viewBox":"0 -5 10 10",
				"refX":5,
				"refY":0,
				"markerWidth":10,
				"markerHeight":10,
				"orient":"auto"
				})
			.append("path")
			.attr("d", "M0,-5L10,0L0,5")
			.attr("class","arrowHead");
	
	// Legend for Arrow
	svg.append('line')
			.attr('class','vector_leg')
			.attr("x1", width/4-10)
			.attr("y1", 0.1*height/4+20)
			.attr("x2", width/4+10)
			.attr("y2", 0.1*height/4+20)          
			.attr("stroke-width", 1)
			.attr("stroke", "black")
			.style("opacity", 0.5)
			.attr("marker-end", "url(#arrow_end)");
	
	svg.append("text")
		.attr('x',width/4+25)
		.attr('y',0.1*height/4+20)
		.attr("width", 20)
        .attr("height", 10)
		.text("Amount growth indicator in the state");
	
	// Add explanation paragraph
	right_bottom_div.append("p").attr("class","main_explanation").html("<a href='https://www.prosper.com/' onclick='window.open(this.href); return false;'>Prosper Loans</a> is a peer-to-peer lending industry. "+
"<BR> Despite beeing a service outside of the traditional Banking industry, Prosper Loans bussiness has been strongly and uniformly impacted by the "+
"<a href='https://en.wikipedia.org/wiki/Subprime_mortgage_crisis' onclick='window.open(this.href); return false;'>Subprime mortgage crisis</a>");
	right_bottom_div.append("p").attr("class","user_message").html("<br> <br> Please Wait until initial animation is finished");
	
	// Add explanation paragraph
	last_div.append("p").attr("class","last_div").html("Source: <a href='https://docs.google.com/document/d/1w7KhqotVi5eoKE3I_AZHbsxdr-NmcWsLTIiZrpxWx4w/pub?embedded=true'>Loan Data from Prosper</a> <br> By Julien Delbove");
	
	// Function to plot the line graph
	function plot_line_graph(data){
		
		svg_line.append("rect")
			.attr("x", 0.)
			.attr("y", 0.)
			.attr("width", 0.)
			.attr("height", 0.)
			.style("fill", "red")
			.style("opacity", 0.2);
		
		var myChart = new dimple.chart(svg_line, data);
		var x = myChart.addTimeAxis("x", "year"); 
		x.title = "Years";
		var y = myChart.addMeasureAxis("y", "total_loan");
		y.title = "Total Amount Borrowed";
		x.dateParseFormat="%Y";
		x.tickFormat="%Y";
		myChart.addSeries(null, dimple.plot.line);
		myChart.addSeries(null, dimple.plot.scatter); 
		myChart.draw();
		
		var fromX = x._scale(new Date('2007-12-01'));
		var toX = x._scale(new Date('2009-06-01'));
		var fromY = y._scale(0.);
		var toY = y._scale(400000000.);
		
		
		svg_line.select("rect")
			.attr("x", fromX)
			.attr("y", toY)
			.attr("width", toX - fromX)
			.attr("height", fromY - toY);
		
		//arrow definition
		svg_line.append("svg:defs").append("svg:marker")
			.attr({
				"id":"arrow_end",
				"viewBox":"0 -5 10 10",
				"refX":5,
				"refY":0,
				"markerWidth":10,
				"markerHeight":10,
				"orient":"auto"
				})
			.append("path")
			.attr("d", "M0,-5L10,0L0,5")
			.attr("class","arrowHead");
					
		svg_line.append("svg:defs").append("svg:marker")
			.attr({
				"id":"arrow_start",
				"viewBox":"0 -5 10 10",
				"refX":5,
				"refY":0,
				"markerWidth":10,
				"markerHeight":10,
				"orient":"auto"
				})
			.append("path")
			.attr("d", "M10,-5L0,0L10,5")
			.attr("class","arrowHead");

		// line definition
		svg_line.append('line')
			.attr("x1", fromX)
			.attr("y1", toY+50)
			.attr("x2", toX)
			.attr("y2", toY+50)          
			.attr("stroke-width", 1)
			.attr("stroke", "black")
			.attr("marker-end", "url(#arrow_end)")
			.attr("marker-start", "url(#arrow_start)");
		
		svg_line.append("text").text("Subprime mortgage crisis")
				.attr({
					id: "crisis",
					x: fromX-20,
					y: toY+20,
					width: toX - fromX,
					height: 30})
				.style('fill','black');	
				
	}
	
	// Function to add the points on the USA map
	function plot_points(data){
		
		// aggregation function per year
		function agg_years(leaves) {
			var total=d3.sum(leaves,function(d) {return d.LoanOriginalAmount;});
			
			return {
				'Number': leaves.length,
				'Total_Borrowed':total,
				};
		}
		
		// Agglomeration of the Proper Loan data per year and per state			
		var nested=d3.nest()
			.key(function(d){
				if (d.date===null){
					return 0;
				}
				else {
					var year=d.date.getUTCFullYear();
					var month=d.date.getMonth();
					if (month<=5) {
						return +year;
					}
					else {
						return +year+1;
					}
				}
			})
			.key(function(d){
				return d.BorrowerState;
			})
			.rollup(agg_years)
			.entries(data);
				
		// Agglomeration of Prosper Loan data per year
		var nested_year=d3.nest()
			.key(function(d){
				if (d.date===null){
					return 0;
				}
				else {
					var year=d.date.getUTCFullYear();
					var month=d.date.getMonth();
					if (month<=5) {
						return +year;
					}
					else {
						return +year+1;
					}
				}
			})
			.rollup(agg_years)
			.entries(data);
		
		// Filter data with bad information on year (0)
		var nested_year_2 = nested_year.filter(function(d) {
			if ((d.key==="0") || (d.key>=2014) ){
			//if (d.key==="0") {
				return false;
			}
			else {
				return true;
			}
		}).map(function(d) {
			return {
				year: d.key,
				total_loan: d.values.Total_Borrowed
			};
		});
		
		// Call to the function that will create the line graph
		plot_line_graph(nested_year_2);
		
		// Get the max of the Total Amount Borrowed for all the states and all the year to scale 
		// the radius of the points on the map
		var Total_Borrowed_max=d3.max(nested,function(d){
				var v1=d.values;
				return d3.max(v1,function(k){return k.values.Total_Borrowed;});
		});
		
		// Scaling function for the point radius
		var radius=d3.scale.sqrt()
					.domain([0,+Total_Borrowed_max])
					.range([0,20]);
		
		// Scaling for the growth rate increase
		var vector_scale=d3.scale.linear()
					.domain([0,1])
					.range([0,40]);
		
		// Function to update the graph depending on the year
		function update(year){
			
			left_div.select("p.title_line_graph").text("Total Amount of Money Borrowed in "+year);
			right_top_div.select("p.title_map_graph").text("Amount Borrowed per State in "+year);
			
			// Filtering of the data for the current year
			var filtered=nested.filter(function(d){
				return new Date(d.key).getUTCFullYear() === year;
				});
			// Filtering of the data for the next year
			var filtered_np1=nested.filter(function(d){
				return new Date(d.key).getUTCFullYear() === year+1;
				});
			
			// Creation of a list of the state for which data are available for the current year
			var countries=filtered[0];
			var states=d3.set();
			countries.values.forEach(function(d){
					states.add(d.key);
				});

			// update radius function
			function update_radius(d){	
				if (states.values().indexOf(d.properties.abbr) !== -1){
					var curr_state=d.properties.abbr;
					var filtered_l2=filtered[0].values.filter(function(d){
						
						return d.key === curr_state;
					});
					var filtered_l2_np1=filtered_np1[0].values.filter(function(d){
						
						return d.key === curr_state;
					});
					var rad=radius(+filtered_l2[0].values.Total_Borrowed);
					if (filtered_l2_np1.length===1){
						var tng_num=(filtered_l2_np1[0].values.Total_Borrowed-filtered_l2[0].values.Total_Borrowed)/filtered_l2[0].values.Total_Borrowed;
						return {
							rad:rad,
							dx:Math.cos(Math.atan(tng_num)),
							dy:Math.sin(Math.atan(tng_num)),
							mark:1
							};
					}
					else {
						return {
							rad:rad,
							dx:1,
							dy:0.,
							mark:1
							};
					}
				}
				else {
					return {
							rad:0.,
							dx:0.,
							dy:0.,
							mark:0
							};
				}
			}

			// Update the radius of the state
			svg.selectAll("circle.bubble")
					.transition()
					.duration(500)
					.attr("r",function(d) {
						var vec=update_radius(d);
						return vec.rad;
					});
			
			// Update the vector of the state
			svg.selectAll("line.vector")
					.transition()
					.duration(500)
					.attr("x2",function(d) {
						var vec=update_radius(d);
						var x1=d3.select(this).attr("x1");
						return +x1+vector_scale(vec.dx);
					})
					.attr("y2",function(d) {
						var vec=update_radius(d);
						var y1=d3.select(this).attr("y1");
						return +y1-vector_scale(vec.dy);
					})
					.attr("marker-end", function(d) {
						var vec=update_radius(d);
						if (vec.mark===1) {
							return "url(#arrow_end)";
						}
						else {
							return "";
						}
					});
					
			// Update the color of the cicle on the line graph for the current year
			svg_line.selectAll("circle.dimple-series-1").filter(function(d){
				if (d.key.indexOf(year) !=-1 ){
					return true;
				}
				else {
					return false;
				}
			})
			.transition()
			.duration(500)
			.attr('r',10)
			.style("fill","darkblue");
			
			// Set the color of all circle for the years different than the current year at the default value
			svg_line.selectAll("circle.dimple-series-1").filter(function(d){
				if (d.key.indexOf(year) !=-1 ){
					return false;
				}
				else {
					return true;
				}
			})
			.transition()
			.duration(500)
			.attr('r',5)
			.style("fill","#80B1D3");	
		}
		
		// Initial annimation for the author-driven narrative
		var years=[];
		for(var year = 2006; year <= 2013; year += 1) {
            years.push(year);
		}
		
		var year_idx=0;
		
		var year_interval=setInterval(function(){
			update(years[year_idx]);
			year_idx++;
		
			if (year_idx>=years.length) {
				clearInterval(year_interval);
				
				right_bottom_div.select("p.user_message").text("Click on Line Chart circles to display previous year information");
				
				svg_line.selectAll("circle").on("click", function(d) {			
					var curr_year=new Date(d.cx+"-01-02").getUTCFullYear();
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
		
		svg.selectAll("path")
			.data(state_data.features)
			.enter()
			.append("path")
			.attr("class","state")
			.attr("d",path)
			.style("fill","#F4F4F4")
			.style("stroke","black")
			.style("stroke_width",0.3);
		
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
		svg.selectAll('circle')
			.data(state_data.features)
			.enter()
			.append('circle')
			.attr('class','bubble')
			.attr("cx",get_cx)
			.attr("cy",get_cy)
			.attr("r",0.)
			.style("opacity", 0.5);
			
		// line definition
		svg.selectAll('line')
			.data(state_data.features)
			.enter()
			.append('line')
			.attr('class','vector')
			.attr("x1", get_cx)
			.attr("y1", get_cy)
			.attr("x2", get_cx)
			.attr("y2", get_cy)          
			.attr("stroke-width", 1)
			.attr("stroke", "black")
			.style("opacity", 0.5);
			
		// Date format in the Prosper Loan data
		var format=d3.time.format("%Y-%m-%d %H:%M:%S.%L000000");
	
		// Read Proper Loan data and draw the graph
		d3.csv("/data/prosperLoanData.csv",function(d) { 
				d.date=format.parse(d.ListingCreationDate);
				return d;
			},plot_points);
	}
	
	// Read the states json file and draw the states map
	d3.json("Delbulien/Udacity_DAND_P6/master/data/gz_2010_us_040_00_20m.json", draw_States);
}
