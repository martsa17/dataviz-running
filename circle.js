      const width_c = 45,
        height_c = 45,
        margin_c = 4;
      radius = 10;
      min_val = 5;
      max_val = 5;

      const svg_c1 = d3
        .select("#circle-1")
        .append("svg")
        .attr("width", width_c)
        .attr("height", height_c)
        .append("g")
        .attr("transform", `translate(${width_c / 2},${height_c / 2})`);

      function drawPie(min_val, max_val) {
        var output = document.getElementById("minval");
        output.innerHTML = min_val;
        var output = document.getElementById("maxval");
        output.innerHTML = max_val;
        d3.csv("Lyon.csv").then(function (d) {
          var inf = 0;
          var moy = 0;
          var sup = 0;

          for (i = 0; i < d.length; i++) {
            if (parseFloat(d[i].vitesse) < min_val) {
              inf++;
            }
            if (parseFloat(d[i].vitesse) > max_val) {
              sup++;
            }
          }

          pourc_inf = parseFloat((inf / d.length) * 100);
          pourc_sup = parseFloat((sup / d.length) * 100);
          pourc_moy = 100 - pourc_inf - pourc_sup;

          data = { inf: pourc_inf, moy: pourc_moy, sup: pourc_sup };
          //console.log(data);

      const color1 = d3.scaleOrdinal().range(["#F3D617","#EF9B0F","#E63201"]);
      const color2 = d3.scaleOrdinal().range(["#D7D7D7","#848484","#4E4E4E"]);
      const color3 = d3.scaleOrdinal().range(["#0AC4EC","#318CE7","#0F056B"]);
      const color4 = d3.scaleOrdinal().range(["#C2F732","#16B84E","#00561B"]);

          // Création de l'échelle de couleur
          const pie = d3.pie().value((d) => d[1]);

          const data_ready = pie(Object.entries(data));

          // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
          svg_c1
            .selectAll("path")
            .data(data_ready)
            .join("path")
            .attr(
              "d",
              d3.arc().innerRadius(20).outerRadius(16) // This is the size of the donut hole
            )
            .attr("fill", (d) => color1(d.data[0]))
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
    
