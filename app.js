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

d3.csv("Lyon.csv").then(function (data) {
  data.forEach(function (d) {
    d.duree = +d.duree / 3600;
    d.alt = parseFloat(d.altitude);
    d.dist = parseFloat(d.distance_cum) / 1000;
    d.vit = parseFloat(d.vitesse);
    d.id = +d.identifiant;
  });

  var len = data.length;

  var nb_id = data[len - 1].id;

  var course = [];

  for (let i = 0; i < nb_id; i++) {
    course[i] = data.filter(function (d) {
      return d.id == i + 1;
    });
  }

  const vit_moy = d3.mean(data, (d) => d.vit);

  const y = d3.scaleLinear().range([height, 0]).domain([5, 15]);

  const x = d3
    .scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, (d) => d.dist)]);

  const z = d3.scaleLinear().range([height, 0]).domain([0, 700]);

  function color(i) {
    if (i == 1) return "#ff0000";
    if (i == 2) return "#ff0055";
    if (i == 3) return "#ff00aa";
    if (i == 4) return "#ff00ff";
    if (i == 5) return "#aa00ff";
    if (i == 6) return "#5500ff";
    if (i == 7) return "#0055ff";
    if (i == 8) return "#00aaff";
    if (i == 9) return "#00ffff";
    if (i == 10) return "#00ffaa";
    if (i == 11) return "#00ff55";
    if (i == 12) return "#00ff00";
    if (i == 12) return "#55ff00";
    else return "#aaff00";
  }

  console.log(color(2));
  const area = d3
    .area()
    .x((d) => x(d.dist))
    .y0(height)
    .y1((d) => z(d.alt));

  var areaPath = svg
    .append("path")
    .datum(course[0])
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

  function addMovingAverage(data, x, y, N, color) {
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
      .style("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("opacity", "0.65")
      .on("mouseover", function (d, i) {
        d3.select(this)

          .attr("opacity", "1")
          .attr("stroke-width", 2.5);
      })
      .on("mouseout", function (d, i) {
        d3.select(this)

          .attr("opacity", "0.65")
          .attr("stroke-width", 1.5);
      });
  }
  for (let i = 0; i < nb_id; i++) {
    addMovingAverage(course[i], x, y, 2, color(i + 1));
  }

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
    for (let i = 0; i < nb_id; i++) {
      d3.select("#graph").remove();
    }
    for (let i = 0; i < nb_id; i++) {
      addMovingAverage(course[i], x, y, w, color(i + 1));
    }
  }
  d3.select("#slider").on("input", function () {
    updateViz(+this.value);
  });
});
