var svgWidth = 960;
var svgHeight = 500;
var margin = { top: 20, right: 40, bottom: 60, left: 100 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var chart = svg.append('g');

d3.select("#scatter").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv("data.csv").then(function (healthData) {
    console.log(healthData)

    healthData.forEach(function (data) {
        data.obesityHigh = +data.obesityHigh;
        data.smokesHigh = +data.smokesHigh;

    });


    var yLinearScale = d3.scaleLinear().range([height, 0]);

    var xLinearScale = d3.scaleLinear().range([0, width]);

    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    xLinearScale.domain([0, d3.max(healthData, function (data) {
        return +data.obesityHigh;
    })]);

    yLinearScale.domain([0, d3.max(healthData, function(data){
        return +data.smokesHigh;
    })]);



    var toolTip = d3
        .tip()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function (data) {
            var stateName = data.state;
            var obesity = +data.obesityHigh;
            var smokes = +data.smokesHigh;
            return (
                stateName + '<br> High Obesity: ' + obesity + '% <br> High Smoking: ' + smokes + '%'
            );
        });

    
    chart.call(toolTip);


    chart.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", function(data) {
            return xLinearScale(data.obesityHigh)
        })
        .attr("cy", function(data) {
            return yLinearScale(data.smokesHigh)
        })
        .attr("r", "15")
        .attr("fill", "lightblue")
        // display tooltip on click
        .on("mouseenter", function(data) {
            toolTip.show(data);
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    
    // Appending a label to each data point
    chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(healthData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.obesityHigh - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.smokesHigh - 0.2);
            })
            .text(function(data) {
                return data.abbr
            });
    
    // Append an SVG group for the xaxis, then display x-axis 
    chart
        .append("g")
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    // Append a group for y-axis, then display it
    chart.append("g").call(yAxis);

    // Append y-axis label
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("High Obesity (%)")

    // Append x-axis labels
    chart
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("High Smoking (%)");
        
});








