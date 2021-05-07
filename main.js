const width = window.innerWidth;
    const height = window.innerHeight;

    const projection = d3.geoMercator()
      .translate([width / 2, height / 2])
      .scale((width - 1) / 2 / Math.PI);

    const path = d3.geoPath()
      .projection(projection);

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed);
    
    const svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');
    
    svg.call(zoom);
    d3.json('world.json', function(error, world) {
        g.append('path')
          .datum({ type: 'Sphere' })
          .attr('class', 'sphere')
          .attr('d', path);

        g.append('path')
          .datum(topojson.merge(world, world.objects.countries.geometries))
          .attr('class', 'land')
          .attr('d', path);

        g.append('path')
          .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
          .attr('class', 'boundary')
          .attr('d', path);
          console.log(world.objects.countries)
      });
    
      
    // d3.json('world.topojson')
    //   .then(world => {
    //     g.append('path')
    //       .datum({ type: 'Sphere' })
    //       .attr('class', 'sphere')
    //       .attr('d', path);

    //     g.append('path')
    //       .datum(topojson.merge(world, world.objects.countries.geometries))
    //       .attr('class', 'land')
    //       .attr('d', path);

    //     g.append('path')
    //       .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
    //       .attr('class', 'boundary')
    //       .attr('d', path);
    //   });
    // d3.json("world.topojson", function(error, data) {
    //             if (error) throw error;
    //             var countries = topojson.feature(data, data.objects.countries).features
    //             // g.selectAll(".com")
    //             //     .data(topojson.feature(us, us.objects.limits).features)
    //             //     .enter()
    //             //     .append("path")
    //             //     .attr("id", "state-borders")
    //             //     .attr("d", path);
    //             svg.selectAll(".country")
    //             .data(countries)
    //             .enter().append("path")
    //             .attr("class", "country")
    //             .attr("d", path)
    //           });
    
    function zoomed() {
      g
        .selectAll('path') // To prevent stroke width from scaling
        .attr('transform', d3.event.transform);
    }


// var width = 960,
//     height = 500;

// var projection = d3.geoMercator()
//     .scale(4000)
//     .center([2.8, 41.9])
//     .translate([width/2, height/2]);

// var path = d3.geoPath()
//     .projection(projection);

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var g = svg.append("g")
//     .on("wheel.zoom",function(){
//         console.log("zoom")
//         var currScale = projection.scale();
//         var newScale = currScale - 2*event.deltaY;
//         var currTranslate = projection.translate();
//         var coords = projection.invert([event.offsetX, event.offsetY]);
//         projection.scale(newScale);
//         var newPos = projection(coords);

//         projection.translate([currTranslate[0] + (event.offsetX - newPos[0]), currTranslate[1] + (event.offsetY - newPos[1])]);
//         g.selectAll("path").attr("d", path);

//     })
//     .call(d3.drag().on("drag", function(){
//         var currTranslate = projection.translate();
//         projection.translate([currTranslate[0] + d3.event.dx,
//                               currTranslate[1] + d3.event.dy]);
//         g.selectAll("path").attr("d", path);
//     }));
    
//     g.append("rect")
//     .attr("class", "background")
//     .attr("width", width)
//     .attr("height", height)
//     .style("fill","#fcf4e0");

//     d3.json("world.topojson", function(error, data) {
//         if (error) throw error;
//         var countries = topojson.feature(data, data.objects.countries).features
//         // g.selectAll(".com")
//         //     .data(topojson.feature(us, us.objects.limits).features)
//         //     .enter()
//         //     .append("path")
//         //     .attr("id", "state-borders")
//         //     .attr("d", path);
//         svg.selectAll(".country")
//         .data(countries)
//         .enter().append("path")
//         .attr("class", "country")
//         .attr("d", path)
//       });

    // d3.queue()
    // .defer(d3.json, "world.topojson")
    // .await(ready)

    // function ready (error, data) {
    //     // console.log(data)
    //     var countries = topojson.feature(data, data.objects.countries).features

    //     // console.log(countries)

    //     svg.selectAll(".country")
    //     .data(countries)
    //     .enter().append("path")
    //     .attr("class", "country")
    //     .attr("d", path)
    //     .on('click', function(d) {
    //         d3.select(this).classed("selected", true)
    //         var child = this
    //         var parent = child.parentNode;
    //         var index = Array.prototype.indexOf.call(parent.children, child);
    //         // console.log(countries[index].properties.name)
    //         changeBook(countries[index].properties.name)
    //     })
    //     .on('mouseout', function(d) {
    //         d3.select(this).classed("selected", false)
    //     })
    // }
    // function zoomed() {
    //   g
    //     .selectAll('path') // To prevent stroke width from scaling
    //     .attr('transform', d3.event.transform);
    // }