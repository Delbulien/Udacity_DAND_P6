function draw() {
    "use strict";
    var margin = 75,
		width = 1300 - margin,
        height = 600 - margin;

	d3.select("body")
		.append("h2")
		.text("Prosper Loan Evolution from 2005 to 2014")
	
	var main_div=d3.select("body").append("div").attr("class","main_div").style('display', 'flex')
	var left_div=main_div.append("div").attr("class","left_div").style("width",width/2 + margin/2)
	var right_div=main_div.append("div").attr("class","right_div").style("width",width/2 + margin/2 )
	var right_top_div=right_div.append("div").attr("class","right_top_div")
	var right_bottom_div=right_div.append("div").attr("class","right_bottom_div")
	
	
	//var svg_line = d3.select("body")
	var svg_line=left_div
        .append("svg")
        .attr("width", width/2 + margin/2)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'chart');
		//.attr("transform", "translate(" + margin + "," + margin + ")");		
	
	//var svg = d3.select("body")
	var svg = right_top_div
        .append("svg")
        .attr("width", width/2 + margin/2)
        .attr("height", 3./4. *height + margin/2.)
        .append('g')
        .attr('class', 'map');
		//.attr("transform", "translate(" + margin + "," + margin + ")");
		
	//debugger;
	
	var explanation="Amount Borrowed through Prosper Loans is rapidly increasing in all the united despite having been impacted by the subprime crisis! (Click on line chart points to display specific year values)"
	right_bottom_div.text(explanation)
	
	//svg.append("text").text(explanation)
	//			.attr({
	//			id: "explanation",
	//			x: 0.,
	//			y: 7./8.*height,
	//			width: width/2,
	//			height: 1./4.*height});
				
	
	function plot_line_graph(data){
		//debugger;
		svg_line.append("text")
        .attr("x", (width / 4))             
        .attr("y", margin / 2)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        //.style("text-decoration", "underline")  
        .text("Total Amount of Money Borrowed");
		
		var myChart = new dimple.chart(svg_line, data);
		
		var x = myChart.addTimeAxis("x", "year"); 
		x.title = "Years"
        var y = myChart.addMeasureAxis("y", "total_loan");
		y.title = "Total Amount Borrowed"
		x.dateParseFormat="%Y";
		x.tickFormat="%Y";
		//x.tickFormat=",4f";
		//y.tickFormat = ",.4f";
		//x.timeInterval=4;
          /*myChart.addSeries(null, dimple.plot.bar);*/
		  /*myChart.addSeries(null, dimple.plot.scatter);*/
		myChart.addSeries(null, dimple.plot.line);
		myChart.addSeries(null, dimple.plot.scatter);
		  
        myChart.draw();
	}
	
	
	function plot_points(data){
		//debugger;
		
		function agg_years(leaves) {
			var total=d3.sum(leaves,function(d) {return d['LoanOriginalAmount'];});
			
			return {
				'Number': leaves.length,
				'Total_Borrowed':total,
				};
		};
		
		console.log(data[0]);
		//debugger;
		
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
				
		console.log(nested[0]);
		//debugger;
		
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
		
		plot_line_graph(nested_year_2)
		
		var Total_Borrowed_min=d3.min(nested,function(d){
				var v1=d.values
				//console.log(v1)
				var v2=v1[0].values['Total_Borrowed']
				//console.log(v2)
				//debugger;
				return d3.min(v1,function(k){return k.values['Total_Borrowed']});
		})
		
		var Total_Borrowed_max=d3.max(nested,function(d){
				var v1=d.values
				//console.log(v1)
				//var v2=v1[0].values['Total_Borrowed']
				//console.log(v2)
				//debugger;
				return d3.max(v1,function(k){return k.values['Total_Borrowed']});
		})
		
		var radius=d3.scale.sqrt()
					.domain([0,+Total_Borrowed_max])
					.range([0,20]);
		
		console.log(Total_Borrowed_max);
		//debugger;
		
		function update(year){
		
			var filtered=nested.filter(function(d){
				return new Date(d['key']).getUTCFullYear() === year;
				});
			
			d3.select("h2")
				.text("Total Amount of money Borrowed through Prosper Loan in "+year);
			
			console.log(filtered[0]);
			
			var countries=filtered[0];
			//debugger;
			console.log(countries.values[0]);
			//console.log(d3.keys(countries));
			//debugger;
			
			var states=d3.set();
			countries.values.forEach(function(d){
					states.add(d.key);
				});
			console.log(states.values());
			//debugger;
			
			function update_countries(d){	
				if (states.values().indexOf(d.properties.abbr) !== -1){
					return "rgb(9,157,217)";
				}
				else {
					return "white";
				}
				
			}
			console.log(countries[0]);
			
			svg.selectAll("path")
					.transition()
					.duration(500)
					.style("fill",update_countries);
					//.style("stroke",update_countries);
			
			
			function update_radius(d){	
				if (states.values().indexOf(d.properties.abbr) !== -1){
					var curr_state=d.properties.abbr
					console.log(curr_state)
					console.log(filtered[0])
					var filtered_l2=filtered[0].values.filter(function(d){
						
						return d.key === curr_state;
					});
					console.log(filtered_l2[0])
					var rad=radius(+filtered_l2[0].values["Total_Borrowed"])
					console.log(filtered_l2[0].values["Total_Borrowed"])
					console.log(rad)
					//debugger;
					return rad;
				}
				else {
					return 0.;
				}
				//radius(d.values["attendance"]);})
			}
			
			//debugger
			
			svg.selectAll("circle")
					.transition()
					.duration(500)
					.attr("r",update_radius)
					
			console.log(svg_line.selectAll("circle"))
			//debugger
			svg_line.selectAll("circle.dimple-series-1").filter(function(d){
				
				console.log(d)
				//debugger;
				if (d.key.indexOf(year) !=-1 ){
					return true
				}
				else {
					return false
				}
					//return d3.select(this).attr("class").contains(year);
			})
			.transition()
			.duration(500)
			.style("fill","red")
			
			svg_line.selectAll("circle.dimple-series-1").filter(function(d){
				
				console.log(d)
				//debugger;
				if (d.key.indexOf(year) !=-1 ){
					return false
				}
				else {
					return true
				}
					//return d3.select(this).attr("class").contains(year);
			})
			.transition()
			.duration(500)
			.style("fill","#80B1D3")
			
			
		};
		
		//var year=2013;
		//update(year);
		//debugger;
		
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
				
				
				svg_line.selectAll("circle").on("click", function(d) {
                    //svg_line.selectAll("circle")
                    //  .transition()
                    //  .duration(500)
                    //  .style("fill", "#80B1D3");
					
					console.log(new Date(d.cx).getUTCFullYear())
					
					var curr_year=new Date(d.cx).getUTCFullYear();
					curr_year=curr_year+1
					console.log(curr_year);
					//debugger;
					update(curr_year);
					
					//console.log(d.cx);
					//console.log(new Date(d.cx).getUTCFullYear())
					//console.log(d3.select("this"));
					//debugger;
					
					//d3.select("this")
					//	.transition()
					//	.duration(500)
					//	.style("fill", "red");
                      
				});
					
			}
		
		},1000);

	}
	
	
	function draw_States(state_data){
		// D3 Projection
		
		svg.append("text")
        .attr("x", (width / 4))             
        .attr("y", margin / 2)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        //.style("text-decoration", "underline")  
        .text("Amount Borrowed per states");
		
		var projection = d3.geo.albersUsa()
			.translate([width/4, 3./4.*height/2 ])    // translate to center of screen
			.scale([700]);          // scale things down so see entire US
        
		// Define path generator
		var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	.projection(projection);  // tell path generator to use albersUsa projection
		//debugger;
		var map=svg.selectAll("path")
			.data(state_data.features)
			.enter()
			.append("path")
			.attr("d",path)
			.style("fill","white")
			.style("stroke","black")
			.style("stroke_width",0.5);
		//debugger;
		
		function compute_cx(state_features) {
			var geom_type=state_features.geometry.type;
			var geom_coord=state_features.geometry.coordinates[0];
			//console.log(geom_type)
			//console.log(geom_coord[0])
			//var coords=geom_coord.map(function(d){return projection([+d[0],+d[1]]);});
			//debugger;
			if (geom_type==="Polygon"){
				var coords=geom_coord.map(function(d){return projection([+d[0],+d[1]]);});
				//console.log(geom_coord[0])
				var center_x=d3.mean(coords,function(d){return d[0];});
				//console.log(center_x)
				//debugger;
				return center_x;
			}
			else {
				var coords=geom_coord[0].map(function(d){return projection([+d[0],+d[1]]);});
				//console.log(projection(+geom_coord[0][0]));
				console.log(geom_coord[0]);
				console.log(geom_coord[0][0]);
				console.log(coords);
				
				var isnull=0;
				coords.forEach(function(d){
					if (d===null) {
						isnull=1
					}
				});
				
				if (isnull===0) {
					var center_x=d3.mean(coords,function(d){return d[0];});
					return center_x;
				}
				else {
					var center_x=0.;
					return center_x;
				}
				//console.log(center_x)
				//debugger;
				
			}
			
			
			/*var cx=parseFloat(0);
			if (geom_type==="Polygon"){
				geom_coord.forEach(function (d) {
					cx+=parseFloat(d[0]);
				})
				
			}
			else {
				geom_coord[0].forEach(function (d) {
					cx+=parseFloat(d[0]);
				})
			}
			
			debugger;
			return cx;*/
			
			
		}
		
		function compute_cy(state_features) {
			var geom_type=state_features.geometry.type;
			var geom_coord=state_features.geometry.coordinates;
			
			if (geom_type==="Polygon"){
				var coords=geom_coord[0].map(function(d){return projection([+d[0],+d[1]]);});
				var center_y=d3.mean(coords,function(d){return d[1];});
				//debugger;
				return center_y;
			}
			else {
				var coords=geom_coord[0][0].map(function(d){return projection([+d[0],+d[1]]);});
				
				var isnull=0;
				coords.forEach(function(d){
					if (d===null) {
						isnull=1
					}
				});
				
				if (isnull===0) {
					var center_y=d3.mean(coords,function(d){return d[1];});
					return center_y;
				}
				else {
					var center_y=0.;
					return center_y;
				}
			}
			
			
			/*var cy=0;
			if (geom_type==="Polygon"){
				geom_coord.forEach(function (d) {
					cy+=parseFloat(d[1]);
				})
				
			}
			else {
				geom_coord[0].forEach(function (d) {
					cy+=parseFloat(d[1]);
				})
			}
			
			//debugger;
			return cy;*/
			
		}
		
		function get_cx(state_features) {
			var pos=projection([+state_features.properties.lon,+state_features.properties.lat]);
			//console.log(pos)
			//debugger;
			return pos[0];
		}
		
		function get_cy(state_features) {
			var pos=projection([+state_features.properties.lon,+state_features.properties.lat]);
			return pos[1];
		}
		
		var circles=svg.append('g')
			.attr('class','bubble')
			.selectAll('circle')
			.data(state_data.features)
			.enter()
			.append('circle')
			.attr("cx",get_cx)
			.attr("cy",get_cy)
			.attr("r",0.);
		
		
		
		
		
		var format=d3.time.format("%Y-%m-%d %H:%M:%S.%L000000");
		//"2007-08-26 19:09:29.263000000"
		//debugger;
	
		d3.csv("/data/prosperLoanData.csv",function(d) { 
				d['date']=format.parse(d['ListingCreationDate']);
				//d['attendance']= +d['attendance'];
				return d;
			},plot_points);
	}
	
	
	d3.json("/data/gz_2010_us_040_00_20m.json", draw_States)
	
	
/*	function plot_US_States(data){
		// Load GeoJSON data and merge with states data
		//d3.json("/data/us_states.geojson", draw_States)
		d3.json("/data/gz_2010_us_040_00_20m.json", draw_States)
		debugger;
		plot_points(data)
		debugger;
	}
	

	
	var format=d3.time.format("%Y-%m-%d %H:%M:%S.%L000000");
	//"2007-08-26 19:09:29.263000000"
	debugger;
	
	d3.csv("/data/prosperLoanData.csv",function(d) { 
				d['date']=format.parse(d['ListingCreationDate']);
				//d['attendance']= +d['attendance'];
				return d;
			},plot_US_States);
			
	debugger; */
	
}

