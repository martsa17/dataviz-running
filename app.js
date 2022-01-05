// Notre code viendra ici
const margin = { top: 50, right: 30, bottom: 30, left: 60 },
  width = 800,
  height = 400 - margin.top - margin.bottom;

// Création du SVG
const svg = d3
  .select("#graphwindow")
  .append("svg")
  .attr("id", "svg")
  .attr("width", width + margin.left + margin.right + 50)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// Titre
svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 0 - margin.top / 2)
  .attr("text-anchor", "middle")
  .style("fill", "#5a5a5a")
  .style("font-family", "Raleway")
  .style("font-weight", "300")
  .style("font-size", "24px")
  .text("Evolution de la vitesse au cours du trajet");

d3.csv("runningmoy.csv").then(function (data) {
  data.forEach(function (d) {
    d.date = +d.date / 3600;
    d.alt = parseFloat(d.alt.replace(",", "."));
    d.dist = parseFloat(d.dist.replace(",", "."));
    d.vit = parseFloat(d.vit.replace(",", "."));
    d.pente = parseFloat(d.pente.replace(",", "."));
  });

  const vit_moy = d3.mean(data, (d) => d.vit);

  const y = d3.scaleLinear().range([height, 0]).domain([0, 30]);

  const x = d3
    .scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, (d) => d.dist)]);

  const z = d3.scaleLinear().range([height, 0]).domain([0, 700]);

  const area = d3
    .area()
    .x((d) => x(d.dist))
    .y0(height)
    .y1((d) => z(d.alt));

  var areaPath = svg
    .append("path")
    .datum(data)
    .style("fill", "#c6ecc6")
    .attr("d", area);

  function movingAverage(array, count) {
    var result = [],
      val;

    for (
      var i = Math.floor(count / 2), len = array.length - count / 2;
      i < len;
      i++
    ) {
      val = d3.mean(array.slice(i - count / 2, i + count / 2), (d) => d.vit);
      result.push({ dist: array[i].dist, vit: val });
    }

    return result;
  }

  function addMovingAverage(data, x, y, N) {
    const line = d3
      .line()
      .x((d) => x(d.dist))
      .y((d) => y(d.vit))
      .curve(d3.curveMonotoneX); // Fonction de courbe permettant de l'adoucir

    let moveaverage = movingAverage(data, N); // Moyenne mobile sur 10 jours

    svg
      .append("path")
      .attr("id", "graph")
      .datum(moveaverage)
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "#ffab00")
      .style("stroke-width", 2);
  }
  addMovingAverage(data, x, y, 2);

  // axe x
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .attr("fill", "#000")
    .attr("x", width - 50)
    .attr("y", -6)
    .text("Distance (en km)");

  // axe y
  svg
    .append("g")
    .style("fill", "#ffab00")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .style("text-anchor", "end")
    .text("Vitesse (en km/h)");

  // axe q
  svg
    .append("g")
    .attr("transform", "translate(" + width + ", 0)")
    .style("fill", "#c6ecc6")
    .call(d3.axisRight(z))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .attr("dy", "-0.71em")
    .style("text-anchor", "end")
    .text("Altitude (en m)");

  svg
    .selectAll("y axis")
    .data(y.ticks(10))
    .enter()
    .append("line")
    .attr("class", "horizontalGrid")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", (d) => y(d))
    .attr("y2", (d) => y(d));

  function updateViz(w) {
    d3.select("#graph").remove();
    addMovingAverage(data, x, y, w);
  }

  /*d3.select("#inlineRadio1").on("click", function () {
    updateViz(2);
  });
  
  d3.select("#inlineRadio2").on("click", function () {
    updateViz(20);
  });
  
  d3.select("#inlineRadio3").on("click", function () {
    updateViz(60);
  }); */
  
  d3.select("#slider").on("input", function () {
    updateViz(+this.value);
  });
  
});
