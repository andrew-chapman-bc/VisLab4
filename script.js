let wealth;
d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
    wealth = data
	console.log('wealth', wealth);
    makeSVG()
	
});





function makeSVG() {
    const svgwidth = 650;
    const svgheight = 500;
    

    const margin = ({top: 40, right: 40, bottom: 40, left: 40})
    const width = svgwidth - margin.left - margin.right
    const height = svgheight - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let extentIncome = d3.extent(wealth, d => d.Income)
    let extentLife = d3.extent(wealth, d => d.LifeExpectancy)
    let extentPop = d3.extent(wealth, d=> d.Population)
    console.log('wealth extent', extentIncome)
    const xScale = d3.scaleLinear()
                .domain([0,extentIncome[1]])
                .range([0,width]);
    const yScale = d3.scaleLinear()
                .domain([extentLife[0],extentLife[1]])
                .range([height,0]); 
    const rScale = d3.scaleLinear()
                .domain([0,extentPop[1]])
                .range([5, 25]);   
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)


    let toolTip = d3.select('.tooltip')

    svg.selectAll("circle")  
        .data(wealth)
        .enter()
        .append("circle")
        .attr("fill", d=>colorScale(d.Region))
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr("r", d=>rScale(d.Population))
        .attr("stroke", "black")
        .attr("opacity", 0.7)
        .on("mouseenter", (event, d) => {
            toolTip.style("display","block")
            const pos = d3.pointer(event, window);
            toolTip.style("top", pos[1]+10+"px")
            toolTip.style("left", pos[0]+10+"px")
            toolTip.html(`<div>Country: ${d.Country}</div> <div>LifeExpectancy: ${d.LifeExpectancy}</div> <div>Income: ${d.Income}</div> <div>Population: ${d.Population}</div> <div>Region: ${d.Region}</div>`);
            //toolTip.html(`<div>LifeExpectancy: ${d.LifeExpectancy}</div>`);
            //toolTip.html(`<div>Income: ${d.Income}</div>`);
            //toolTip.html(`<div>Population: ${d.Population}</div>`);
            //toolTip.html(`<div>Region: ${d.Region}</div>`);
        })
        .on("mouseleave", (event, d) => {
            toolTip.style("display","none")
        });

    console.log(xScale(extentIncome[1]), yScale(extentLife[0]), colorScale.domain());

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, "s")
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(7, "s")
    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)

    //draw label
    svg.append("text")
		.attr('x', width-50)
		.attr('y', height+30)
		.attr("class", "incomeLabel")
        .attr("alignment-baseline", "baseline")
        .attr("font-size", 14)
        .attr("font-family", "sans-serif")
		.text("Income")

    svg.append("text")
		//.attr('x', 520)
		//.attr('y', 450)
		.attr("class", "lifeLabel")
        .attr("alignment-baseline", "baseline")
        .attr("font-size", 12)
        .attr("font-family", "sans-serif")
        .attr("writing-mode", "tb")
        .attr("dx", 10)
		.text("Life Expectancy")

    console.log("COLOR SCALE",colorScale)
    svg.append("g")
        .selectAll("rect") 
        .data(Array.from( new Set(wealth.map(d=>d.Region))))
        .enter()
        .append("rect")
        .attr('x', width-140)
        .attr('y', function(d, i) {
            return ((i * 20) + (height-150));
        })
        .attr("fill", function(d) {
            return colorScale(d);
        })
        .attr('width', 15)
        .attr('height', 15)

    svg.append("g")
        .selectAll('text')
        .data(Array.from( new Set(wealth.map(d=>d.Region))))
        .enter()
        .append('text')
        .attr('x', width-120)
        .attr('y', function(d, i) {
            return ((i * 20) + (height-140));
        })
        .text(function(d) {
            return d;
        })
        .attr("font-size", 11)
        .attr('text-anchor',"start")


        
}
