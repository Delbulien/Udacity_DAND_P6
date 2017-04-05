function draw() {
    "use strict";
    var margin = 75,
		width = 1400 - margin,
        height = 600 - margin;

	d3.select("body")
		.append("h2")
		.text("Total Amount of money Borrowed through Prosper Loan")
	
	var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'map');
		
		

	
	function plot_points(data){
		
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
		
			if (year_idx>=years.length) {
				clearInterval(year_interval);
			}
		
		},1000);

	}
	
	
	function draw_States(state_data){
		// D3 Projection
		var projection = d3.geo.albersUsa()
			.translate([width/2, height/2])    // translate to center of screen
			.scale([1000]);          // scale things down so see entire US
        
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

