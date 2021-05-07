// I used the following guides to help (in addition to stackexchange) for d3:
// https://bl.ocks.org/vasturiano/f821fc73f08508a3beeb7014b2e4d50f
// https://www.youtube.com/watch?v=aNbgrqRuoiE
// This guide was for API calling:
// https://levelup.gitconnected.com/all-possible-ways-of-making-an-api-call-in-plain-javascript-c0dee3c11b8b

(function() {
  // map dimensions
  var height = 400
  width = document.getElementById('map-container').offsetWidth
  var mtop = 75 //top margin for map translation

  // for mobile map view
  if (window.outerWidth < 480) {
    document.getElementById('top-map-margin').className = "row mt-2"
    mtop = 0
  }

  // creat map svg
  var svg = d3.select("#map-container")
  .append("svg")
  .attr("height", 400)
  .attr("width", "100%")
  .attr("id", "map")
  .append("g") // group data points
  .attr("transform", "translate(" + 0 + "," + mtop + ")");
  
  d3.queue()
  .defer(d3.json, "assets/world.topojson")
  .await(createMap)

  // run Mercator projection of map
  var projection = d3.geoMercator()
  .translate([ width/2, height/2 ]) // center it
  .scale(width / 2.5 / Math.PI) // scale adjusts based on window width (with refresh)


  // create path using projection
  var path = d3.geoPath()
  .projection(projection) // make shape from dots

  // appends paths to svg
  function createMap(error, data) {
      var countries = topojson.feature(data, data.objects.countries).features
      svg.selectAll(".country")
      .data(countries)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)

      // on mouseclick, change color and show books
      .on('click', function(d) {
          // reset previous selected country to white
          let prevSelect = document.querySelector(".selected")
          if (prevSelect) {
            d3.select(prevSelect).classed("selected", false)
          }
          d3.select(this).classed("selected", true) // set selected country to salmon pink
          document.getElementById("country-select").innerText = "Click another country for more books"

          let cname = getCountryName(countries, this) // find name of country selected
          document.getElementById("country-name").innerText = cname // set HTML to show country name
          document.getElementById("book").innerHTML = '' // reset cards
          
          // get the books to show (with API call)
          changeBook(cname)
      })

      // on hover, change country color
      .on('mouseover', function(d) {
        d3.select(this).classed("hovered", true) // set color to salmon pink

        // adjust HTML to show country name
        let cname = getCountryName(countries, this)
        document.getElementById("country-select").innerText = `Click ${cname} to view books`
      })

      // after hovering, revert country color
      .on('mouseout', function(d) {
          d3.select(this).classed("hovered", false)
      })
  }
}) ();

// returns the country name based on where mouse is
function getCountryName(countries, country) {
  var child = country
  var parent = child.parentNode
  var index = Array.prototype.indexOf.call(parent.children, child);
  return countries[index].properties.name
}

// checks books.csv to find book titles to make API call
function changeBook(cname) {
  // different path name for local host or github pages
  d3.csv("https://lilyhuan.github.io/PUI_final_project/assets/books.csv", function (data) {
  // d3.csv("assets/books.csv", function(data) {
    // read csv file
    for (var i = 0; i < data.length; i++) {
      if (data[i].Country == cname) {
        let books = data[i] // row in csv matching country name
        // make API calls if book exists
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
  })
}

// API key: AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs
// calls the Google books API: https://developers.google.com/books
function APICall(title, author) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs`)
  request.send();
  request.onload = () => {
    // request is valid
    if(request.status === 200) {
        const obj = JSON.parse(request.response)
        // check if book exists in Google's API database
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
    // if request errors, log error
    } else {
        console.log(`error ${request.status} ${request.statusText}`)
    }
  }
}
