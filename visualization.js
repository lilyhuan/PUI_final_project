// https://www.youtube.com/watch?v=aNbgrqRuoiE

(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;
    width = document.getElementById('map-container').offsetWidth
    // height = document.getElementById('map-container').offsetHeight
    console.log(width, height)
    var svg = d3.select("#map-container")
    .append("svg")
    // .attr("height", height + margin.top + margin.bottom)
    // .attr("width", width + margin.left + margin.right)
    .attr("height", 400)
    .attr("width", "100%")
    // .attr("class", "img-fluid")
    .attr("id", "map")
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 75 + ")");
    // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    
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
    // .scale(90) //zoom in out
    .scale(width / 2.5 / Math.PI)
    //             .rotate([0, 0])
    //             .center([0, 0])
                // .translate([width / 2, height / 2])

    // create path using projection
    var path = d3.geoPath()
    .projection(projection) //make shape from dots

    function ready (error, data) {
        // console.log(data)
        var countries = topojson.feature(data, data.objects.countries).features

        // console.log(countries)

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
            // console.log(countries[index].properties.name)
            changeBook(countries[index].properties.name)
        })
        .on('mouseout', function(d) {
            d3.select(this).classed("selected", false)
        })
    }
}) ();


function changeBook(cname) {
    let card = document.getElementById("book")
    card.innerHTML = cname

    d3.csv("https://lilyhuan.github.io/PUI_final_project/books.csv", function (data) {
        for (var i = 0; i < data.length; i++) {
        //   document.getElementById("book").innerHTML = data[i].Country;
        //   console.log(data[i].Country);
        //   console.log(data[i].Book);
        if (data[i].Country == cname) {
            // card.innerHTML += data[i].Book1
            let books = data[i]
            // APICall(books.Title1, books.Author1)
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

// AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs
// GET https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey

function APICall(title, author) {
    // const userAction = async () => {
    //     const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs');
    //     const myJson = await response.json(); //extract JSON from the http response
    //     // do something with myJson
    //     console.log(myJson)
    //   }
    const request = new XMLHttpRequest();
    console.log(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs`)
    request.open("GET", `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs`)
    request.send();
    request.onload = () => {
        if(request.status === 200) {
            console.log(request.response)
            // console.log(request.response.items)
            const obj = JSON.parse(request.response)
            // console.log(obj.items[0].volumeInfo.imageLinks)
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
