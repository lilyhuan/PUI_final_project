(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

    var svg = d3.select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.queue()
    .defer(d3.json, "world.topojson")
    .await(ready)
    // d3.json("world.topojson", function(data) {
    //     console.log(data);
    //     console.log("hi")
    // });

    // Mercator projection
    var projection = d3.geoMercator()
    .translate([ width/2, height/2 ]) //center it
    .scale(90) //zoom in out

    // create path using projection
    var path = d3.geoPath()
    .projection(projection) //make shape from dots

    function ready (error, data) {
        console.log(data)
        var countries = topojson.feature(data, data.objects.countries).features

        console.log(countries)

        svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .on('mouseover', function(d) {
            d3.select(this).classed("selected", true)
            var child = this
            var parent = child.parentNode;
            var index = Array.prototype.indexOf.call(parent.children, child);
            console.log(countries[index].properties.name)
            changeBook(countries[index].properties.name)
        })
        .on('mouseout', function(d) {
            d3.select(this).classed("selected", false)
        })
    }
}) ();


function changeBook(country) {
    let card = document.getElementById("book")
    card.innerHTML = country

}