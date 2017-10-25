var d3 = require('d3');

exports.Thermometer = Thermometer;


function Thermometer(container) {

    var container = d3.select(container);
    var chart = container.select('.shuokongkeji-thermometer');
    if (chart.empty()) {
        chart = container.append('svg')
            .attr('class', 'shuokongkeji-thermometer');
    }
    this.container = container;
    this.chart = chart;
    this.id = 'shuokongkeji-thermometer' + Date.now();
}

Thermometer.prototype.render = function(data, cfg) {
    var id = this.id;
    var container = this.container;
    var chart = this.chart;
    var width = parseInt(container.style('width')) || 100;
    var height = parseInt(container.style('height')) || 220;
    var globals = cfg.globals;
    var marginLeft = globals.marginLeft || 2;
    var marginRight = globals.marignRight || 2;
    var marginTop = globals.marginTop || 2;
    var marginBottom = globals.marginBottom || 2;
    var innerWidth = width - marginLeft - marginRight;
    var innerHeight = height - marginTop - marginBottom;


    var maxTemp = cfg.tempLine.maxTemp;
    var minTemp = cfg.tempLine.minTemp;
    var currentTemp = data[0].value;
    var fontSize = "12px";
    var InnerTickSize = 7;
    var circleColor = '#ffffff';
    var AxisColor = "#777777";
    
    var bottomY = height - 5,
        topY = 5,
        bulbRadius = width / 20,
        tubeWidth = 21.5,
        tubeBorderWidth = 1,
        mercuryColor = "rgb(230,0,0)",
        innerBulbColor = "rgb(230,200,200)",
        tubeBorderColor = "#99999";
    var bulb_cy = bottomY - bulbRadius,
        bulb_cx = width / 2,
        top_cy = topY + tubeWidth / 2;

    chart.attr('width', width)
        .attr('height', height);

    //Conatainer

    var defs = chart.select('.container');
    if (defs.empty()) {
        defs = chart.append('defs')
            .attr('class', 'container');
    }
    defs.attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
    
    var bulbGradient = defs.append("radialGradient")
        .attr("id", "bulbGradient")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "50%")
        .attr("fx", "50%");
    bulbGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", innerBulbColor);
    bulbGradient.append("stop")
        .attr("offset", "90%")
        .style("stop-color", mercuryColor);

    //Circle element for rounded tube top

    var Circle  = chart.select('.shukongkeji-thermometer-circle')
    if(Circle.empty()){
    chart.append("circle")
        .attr("r", tubeWidth / 2)
        .attr("cx", width / 2)
        .attr("cy", top_cy)
        .attr("class","shukongkeji-thermometer-circle")
        .style("fill", "#FFFFFF")
        .style("stroke", tubeBorderColor)
        .style("stroke-width", tubeBorderWidth + "px");
    }

    // Rect element for tube
    var Rect = chart.select('.shukongkeji-thermometer-rect')
    if(Rect.empty()) {
    chart.append("rect")
        .attr("x", width / 2 - tubeWidth / 2)
        .attr("y", top_cy)
        .attr("height", bulb_cy - top_cy)
        .attr("class","shukongkeji-thermometer-circle")
        .attr("width", tubeWidth)
        .style("shape-rendering", "crispEdges")
        .style("fill", "#FFFFFF")
        .style("stroke", tubeBorderColor)
        .style("stroke-width", tubeBorderWidth + "px");
    }

    // White fill for rounded tube top circle element
    // to hide the border at the top of the tube rect element
    var WhiteCircle = chart.select('.shuokongkeji-top-circle')
    if(WhiteCircle.empty()) {
    chart.append("circle")
        .attr("class","shuokongkeji-top-circle")
        .attr("r", tubeWidth / 2 - tubeBorderWidth / 2)
        .attr("cx", width / 2)
        .attr("cy", top_cy)
        .style("fill", "#FFFFFF")
        .style("stroke", "none")
            
    }


    // Main bulb of thermometer (empty), white fill
   
    var mainWhiteCircle = chart.select('.shuokongkeji-white-bulb-circle')
    if(mainWhiteCircle.empty()) {
    chart.append("circle")
        .attr("r", bulbRadius)
        .attr("cx", bulb_cx)
        .attr("cy", bulb_cy)
        .attr("class","shuokongkeji-white-bulb-circle")
        .style("fill", "#FFFFFF")
        .style("stroke", tubeBorderColor)
        .style("stroke-width", tubeBorderWidth + "px");

    }
    // Rect element for tube fill colour
    var TubeFillColorRect = chart.select('.shuokongkeji-tube-fill-color-rect')
    if(TubeFillColorRect.empty()) {
    chart.append("rect")
        .attr("x", width / 2 - (tubeWidth - tubeBorderWidth) / 2)
        .attr("y", top_cy)
        .attr("height", bulb_cy - top_cy)
        .attr("width", tubeWidth - tubeBorderWidth)
        .attr("class","shuokongkeji-tube-fill-color-rect")
        .style("shape-rendering", "crispEdges")
        .style("fill", "#FFFFFF")
        .style("stroke", "none");
    }

    // Scale step size
    var step = 5;

    // Determine a suitable range of the temperature scale
    var domain = [
        step * Math.floor(minTemp / step),
        step * Math.ceil(maxTemp / step)
    ];

    if (minTemp - domain[0] < 0.66 * step)
        domain[0] -= step;

    if (domain[1] - maxTemp < 0.66 * step)
        domain[1] += step;


    // D3 scale object
    var scale = d3.scale.linear()
        .range([bulb_cy - bulbRadius / 2 - 8.5, top_cy])
        .domain(domain);


    // Max and min temperature lines
    [minTemp, maxTemp].forEach(function(t) {

        var isMax = (t == maxTemp),
            label = (isMax ? "max" : "min"),
            textCol = (isMax ? "rgb(230, 0, 0)" : "rgb(0, 0, 230)"),
            textOffset = (isMax ? -4 : 4);
        var ScaleLine = chart.select(".shuokongkeji-scale-line")
        if(ScaleLine.empty()) {
        chart.append("line")
            .attr("class","shuokongkeji-scale-line")
            .attr("id", label + "Line")                                                          
            .attr("x1", width / 2 - tubeWidth / 2)
            .attr("x2", width / 2 + tubeWidth / 2 + 22)
            .attr("y1", scale(t))
            .attr("y2", scale(t))
            .style("stroke", tubeBorderColor)
            .style("stroke-width", "1px")
            .style("shape-rendering", "crispEdges");
        }

        var ScaleText = chart.select(".shukongkeji-scale-text")
        if(ScaleText.empty()) {

        chart.append("text")
            .attr("x", width / 2 + tubeWidth / 2 + 2)
            .attr("y", scale(t) + textOffset)
            .attr("dy", isMax ? null : "0.75em")
            .attr("class","shukongkeji-scale-text")
            .text(label)
            .style("fill", textCol)
            .style("font-size", fontSize)
        }

    });


    var tubeFill_bottom = bulb_cy,
        tubeFill_top = scale(currentTemp);

    // Rect element for the red mercury column

    var mercuryRect = chart.select(".shukongkeji-mercury-Rect")
    if(mercuryRect.empty()) {
    chart.append("rect")
        .attr("x", width / 2 - (tubeWidth - 10) / 2)
        .attr("y", tubeFill_top)
        .attr("width", tubeWidth - 10)
        .attr("height", tubeFill_bottom - tubeFill_top)
        .attr("class","shukongkeji-mercury-Rect")
        .style("shape-rendering", "crispEdges")
        .style("fill", mercuryColor)
    }

    // Main thermometer bulb fill

    var mainThermometerBulbCircle = chart.select(".shukongkeji-main-bulb-circle")
    if(mainThermometerBulbCircle.empty()) {
    chart.append("circle")
        .attr("r", bulbRadius - 6)
        .attr("cx", bulb_cx)
        .attr("cy", bulb_cy)
        .attr("class","shukongkeji-main-bulb-circle")
        .style("fill", "url(#bulbGradient)")
        .style("stroke", mercuryColor)
        .style("stroke-width", "2px");
    }

    // Values to use along the scale ticks up the thermometer
    var tickValues = d3.range((domain[1] - domain[0]) / step + 1).map(function(v) { return domain[0] + v * step; });


    // D3 axis object for the temperature scale
    var axis = d3.svg.axis()
        .scale(scale)
        .innerTickSize(7)
        .outerTickSize(0)
        .tickValues(tickValues)
        .orient("left");

    // Add the axis to the image
    var tempScale = chart.select(".shukongkeji-tempScale")
    if(tempScale.empty()){
    var svgAxis = chart.append("g")
        .attr("id", "tempScale")
        .attr("class","shukongkeji-tempScale")
        .attr("transform", "translate(" + (width / 2 - tubeWidth / 2) + ",0)")
        .call(axis);
    }
    // Format text labels
    svgAxis.selectAll(".tick text")
        .style("fill", "#777777")
        .style("font-size", "10px");

    // Set main axis line to no stroke or fill
    svgAxis.select("path")
        .style("stroke", "none")
        .style("fill", "none")

    // Set the style of the ticks 
    svgAxis.selectAll(".tick line")
        .style("stroke", tubeBorderColor)
        .style("shape-rendering", "crispEdges")
        .style("stroke-width", "1px");

}