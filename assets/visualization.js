// https://www.youtube.com/watch?v=aNbgrqRuoiE

(function() {
    height = 400
    width = document.getElementById('map-container').offsetWidth
    var mtop = 75

    if (window.outerWidth < 480) {
      document.getElementById('top-map-margin').className = "row mt-2"
      mtop = 0
    }
    var svg = d3.select("#map-container")
    .append("svg")
    .attr("height", 400)
    .attr("width", "100%")
    .attr("id", "map")
    .append("g")
    .attr("transform", "translate(" + 0 + "," + mtop + ")");
    
    d3.queue()
    .defer(d3.json, "assets/world.topojson")
    .await(ready)

    // Mercator projection
    var projection = d3.geoMercator()
    .translate([ width/2, height/2 ]) //center it
    .scale(width / 2.5 / Math.PI)


    // create path using projection
    var path = d3.geoPath()
    .projection(projection) //make shape from dots

    function ready (error, data) {
        var countries = topojson.feature(data, data.objects.countries).features
        svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .on('click', function(d) {
            d3.select(this).classed("selected", true)
            var child = this
            var parent = child.parentNode;
            var index = Array.prototype.indexOf.call(parent.children, child);
            changeBook(countries[index].properties.name)
        })
        .on('mouseout', function(d) {
            d3.select(this).classed("selected", false)
        })
    }
}) ();


function changeBook(cname) {
    document.getElementById("country-name").innerText = cname

    // d3.csv("https://lilyhuan.github.io/PUI_final_project/assets/books.csv", function (data) {
      d3.csv("assets/books.csv", function (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].Country == cname) {
              let books = data[i]
              if (books.Title3 != "None") {
                  APICall(books.Title3, books.Author3)
              }
              if (books.Title2 != "None") {
                  APICall(books.Title2, books.Author2)
              }
              if (books.Title1 != "None") {
                  APICall(books.Title1, books.Author1)
              }

          }
        }
      });
}

// API key: AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs
function APICall(title, author) {
    const request = new XMLHttpRequest();
    console.log(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs`)
    request.open("GET", `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs`)
    request.send();
    request.onload = () => {
        if(request.status === 200) {
            console.log(request.response)
            const obj = JSON.parse(request.response)
            if (obj.totalItems != 0) {
                let card = document.getElementById("book")
            card.innerHTML += `
            <div class="card mb-3" style="max-width: 540px;">
              <div class="row g-0">
                <div class="col-4">
                  <img src="${obj.items[0].volumeInfo.imageLinks.thumbnail}" alt="${title} book cover">
                </div>
                <div class="col-8">
                  <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${author}</p>
                    <a href="${obj.items[0].volumeInfo.infoLink}" class="btn btn-primary" target="_blank">More Info</a>
                  </div>
                </div>
              </div>
            </div>
            `
            } else {
                console.log("BOOK NOT FOUND")
            }
            
        } else {
            console.log("failed")
        }
    }
}
