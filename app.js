// Notre code viendra ici
const margin = { top: 50, right: 30, bottom: 30, left: 60 },
  width = 800,
  height = 400 - margin.top - margin.bottom;

// Création du SVG
const svg = d3
  .select("#chart")
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
  .text("Evolution du temps au cours du trajet");

function addTooltip() {
  // Création d'un groupe qui contiendra tout le tooltip plus le cercle de suivi
  var tooltip = svg.append("g").attr("id", "tooltip").style("display", "none");

  // Le cercle extérieur bleu clair
  tooltip.append("circle").attr("fill", "#CCE5F6").attr("r", 10);

  // Le cercle intérieur bleu foncé
  tooltip
    .append("circle")
    .attr("fill", "#3498db")
    .attr("stroke", "#fff")
    .attr("stroke-width", "1.5px")
    .attr("r", 4);

  // Le tooltip en lui-même avec sa pointe vers le bas
  // Il faut le dimensionner en fonction du contenu
  tooltip
    .append("polyline")
    .attr("points", "0,0 0,40 55,40 60,45 65,40 140,40 140,0 0,0")
    .style("fill", "#fafafa")
    .style("stroke", "#3498db")
    .style("opacity", "0.9")
    .style("stroke-width", "1")
    .attr("transform", "translate(-60, -55)");

  // Cet élément contiendra tout notre texte
  var text = tooltip
    .append("text")
    .style("font-size", "13px")
    .style("font-family", "Segoe UI")
    .style("color", "#333333")
    .style("fill", "#333333")
    .attr("transform", "translate(-50, -40)");

  // Element pour la date avec positionnement spécifique
  text.append("tspan").attr("dx", "-5").attr("id", "tooltip-date");

  // Positionnement spécifique pour le petit rond bleu
  text
    .append("tspan")
    .style("fill", "#3498db")
    .attr("dx", "-60")
    .attr("dy", "15")
    .text("●");

  // Le texte "Pente : "
  text.append("tspan").attr("dx", "5").text("Vitesse : ");

  // Le texte pour la valeur de la vitesse
  text.append("tspan").attr("id", "tooltip-vit").style("font-weight", "bold");

  return tooltip;
}

d3.csv("running_modif2.csv").then(function (data) {
  data.forEach(function (d) {
    d.date = +d.date / 3600;
    d.alt = parseFloat(d.alt.replace(",", "."));
    d.dist = parseFloat(d.dist.replace(",", "."));
    d.vit = parseFloat(d.vit.replace(",", "."));
  });
  const vit_moy = d3.mean(data, (d) => d.vit);
  //console.log(vit_moy);
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(data, (d) => d.date));

  const x = d3
    .scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, (d) => d.dist)]);

  const z = d3
    .scaleLinear()
    .range([height, 0])
    .domain([d3.min(data, (d) => d.vit) - 20, d3.max(data, (d) => d.vit) + 20]);

  const q = d3.scaleLinear().range([height, 0]).domain([0, 500]);

  const area = d3
    .area()
    .x((d) => x(d.dist))
    .y0(height)
    .y1((d) => q(d.alt));

  var areaPath = svg
    .append("path")
    .datum(data)
    .style("fill", "#c6ecc6")
    .attr("d", area);

  const line = d3
    .line()
    .x((d) => x(d.dist))
    .y((d) => y(d.date));

  const line10 = d3
    .line()
    .x((d) => x(d.dist))
    .y((d) => y(d.dist / 10));

  const line12 = d3
    .line()
    .x((d) => x(d.dist))
    .y((d) => y(d.dist / 12));

  const line15 = d3
    .line()
    .x((d) => x(d.dist))
    .y((d) => y(d.dist / 14));

  var linePath = svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  var linePath10 = svg
    .append("path")
    .datum(data)
    .attr("class", "line10")
    .attr("d", line10);

  var linePath12 = svg
    .append("path")
    .datum(data)
    .attr("class", "line12")
    .attr("d", line12);

  var linePath15 = svg
    .append("path")
    .datum(data)
    .attr("class", "line15")
    .attr("d", line15);

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
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .style("text-anchor", "end")
    .text("Temps (en h)");

  // axe q
  svg
    .append("g")
    .attr("transform", "translate(" + width + ", 0)")
    .style("fill", "#c6ecc6")
    .call(d3.axisRight(q))
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

  var tooltip = addTooltip();

  var bisectDist = d3.bisector((d) => d.dist).left;

  svg
    .append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function (event) {
      tooltip.style("display", null);
    })
    .on("mouseout", function (event) {
      tooltip.style("display", "none");
    })
    .on("mousemove", mousemove);

  function mousemove(event) {
    var x0 = x.invert(d3.pointer(event)[0]),
      i = bisectDist(data, x0),
      d = data[i];
    tooltip.attr("transform", "translate(" + x(d.dist) + "," + y(d.date) + ")");

    d3.select("#tooltip-date").text(d.date.toFixed(2) + "h");
    d3.select("#tooltip-vit").text(d.vit.toFixed(1) + "km/h");
  }
});
