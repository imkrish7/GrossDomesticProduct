
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(data=>{
    return data.json();
}).then((resp)=>{
    formatData(resp['data']);
}).catch((error)=>{
    console.log(error);
})

function formatData(data) {

    var requireData = []
    var yearsData=[]
    data.forEach((d)=>{
        requireData.push(d[1]);
        yearsData.push(new Date(d[0]));
    });
 
   var svg=d3.select('.chart')
             .attr('width',900)   
             .attr('height',550)

    var yScale=d3.scaleLinear()
                 .domain([0,d3.max(requireData)])
                 .range([500,0]);

    var xmax=new Date(d3.max(yearsData));

    xmax.setMonth(xmax.getMonth()+3);

    var xScale=d3.scaleTime()
                 .domain([d3.min(yearsData),xmax])
                 .range([0,800]);
           
    var xAxis=d3.axisBottom().scale(xScale);
    var yAxis=d3.axisLeft().scale(yScale).ticks(10);

    svg.append('text')
       .attr('transform','rotate(-90)')
       .attr('x',-200)
       .attr('y',80)
       .text("Gross Domestic Product")

       svg.append('text')
          .attr('x',400)
          .attr('y',540)
          .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
        
    svg.append('g')
       .attr('transform','translate(50,0)')
       .attr('id','y-axis')
       .call(yAxis);

       svg.append('g')
           .attr('transform', 'translate(50,500)')
           .attr('id','x-axis')
           .call(xAxis);

       
           
       var tooltip = d3.select('body')
                       .append('div')
                       .attr('class',"tooltip");

       svg.selectAll('rect').data(requireData)    
          .enter()
          .append('rect')
          .attr('class','bar')
          .attr('data-date',(d,i)=>{
              return yearsData[i]
          })
          .attr('data-gdp',(d)=>{
              return d;
          })
          .attr('x',(d,i)=>{
              return xScale(yearsData[i]);
          })
          .attr('y',(d)=>{
              return  yScale(d);
          })
          .attr('width',(d)=>{
              return 3 + 'px';
          }) 
          .attr('height',(d)=>{
              return 500-yScale(d);
          })
          .attr('transform','translate(51,0)')
          .attr('fill','steelblue')
          .on('mouseover',(d,i)=>{
                tooltip.transition()
                       .style('opacity',0.8);
                var timeFormat=d3.timeFormat("%Y")
                tooltip.text(()=>{
                              return timeFormat(yearsData[i]) +" $" + d + " Billion";
                       })
                       .style('left',(d3.event.pageX + 10)+'px')
                       .style('top',(d3.event.pageY + 15)+'px');
          })
          .on('mouseout',(d)=>{
              tooltip.transition().style('opacity',0)
          })
         
             
             
}

// 