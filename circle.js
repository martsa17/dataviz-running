      const width = 450,
        height = 450,
        margin = 40;
      radius = 10;
      min_val = 5;
      max_val = 5;

      const svg = d3
        .select("#circle")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      function drawPie(min_val, max_val) {
        var output = document.getElementById("minval");
        output.innerHTML = min_val;
        var output = document.getElementById("maxval");
        output.innerHTML = max_val;
        d3.csv("running_modif2.csv").then(function (d) {
          var inf = 0;
          var moy = 0;
          var sup = 0;

          for (i = 0; i < d.length; i++) {
            if (parseFloat(d[i].vit2) < min_val) {
              inf++;
            }
            if (parseFloat(d[i].vit2) > max_val) {
              sup++;
            }
          }

          pourc_inf = parseFloat((inf / d.length) * 100);
          pourc_sup = parseFloat((sup / d.length) * 100);
          pourc_moy = 100 - pourc_inf - pourc_sup;

          data = { inf: pourc_inf, moy: pourc_moy, sup: pourc_sup };
          //console.log(data);

          const color = d3.scaleOrdinal().range(["red", "orange", "green"]);

          // Création de l'échelle de couleur
          const pie = d3.pie().value((d) => d[1]);

          const data_ready = pie(Object.entries(data));

          // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
          svg
            .selectAll("path")
            .data(data_ready)
            .join("path")
            .attr(
              "d",
              d3.arc().innerRadius(200).outerRadius(160) // This is the size of the donut hole
            )
            .attr("fill", (d) => color(d.data[0]))
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .attr("class", "donut");
        });
      }
      drawPie(min_val, max_val);
      d3.select("#slider_min").on("input", function () {
        min_val = +this.value;
        drawPie(min_val, max_val);
        d3.select("#slider_max").min = min_val;
      });
      d3.select("#slider_max").on("input", function () {
        max_val = +this.value;
        drawPie(min_val, max_val);
      });
    
