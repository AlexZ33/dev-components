var d3 = require('d3');
// var tip = require('d3-tip');

module.exports = {
  draw: function(container, events, options){


    // Use the options
    var cfg = {
      width: 600,
      height: 200,
      radius: 10,
      lineWidth: 4,
      color: "#999",
      background: "#FFF",
      dateFormat: "%Y/%m/%d %H:%M:%S",
      horizontalLayout: true,
      showLabels: false,
      labelFormat: "%Y/%m/%d %H:%M:%S",
      addNow: false,
      // seriesColor: d3.scale.category20(),
      dateDimension: true
    };


    //default configuration overrid

    // console.log(options)
    if(options != undefined){
      for(var i in options){
        cfg[i] = options[i];
      }
    }
    if(cfg.addNow != false){
      events.push({date: new Date(), name: cfg.addNowLabel || "Today"});//嵌入insert全局
    }
     
     var margin = {left:50,top:30,right:20,bottom:20};
     var g_width = cfg.width - margin.left -margin.right,
         g_height = cfg.height -margin.top - margin.bottom;
  
    // var tip = d3.select(container)
    //             .append('div')
    //             .attr("class", "remove")
    // .style("opacity", cfg.tipOpacity)
    // .style("position", "absolute")
    // .style("font-family", cfg.tipFontFamily)
    // .style("font-weight", "300")
    // .style("background","rgba(0,0,0,0.5)")
    // .style("color", cfg.tipColor)
    // .style("padding", "5px 10px 5px 10px")
    // .style("-moz-border-radius", cfg.tipRadius)
    // .style("border-radius", cfg.tipRadius);
    var svg = d3.select(container).append('svg').attr("width", cfg.width).attr("height", cfg.height);
    
    var g = d3.select('svg').append('g').attr('transform','translate('+margin.left+','+margin.top+')');

    //Calculate times in terms of timestamps
    if(!cfg.dateDimension){
      var timestamps = events.map(function(d){return  d.value});//new Date(d.date).getTime()});
      var maxValue = d3.max(timestamps);
      var minValue = d3.min(timestamps);
    }else{
      var timestamps = events.map(function(d){return  Date.parse(d.date);});//new Date(d.date).getTime()});
      var maxValue = d3.max(timestamps);
      var minValue = d3.min(timestamps);
    }
    var margin2 = (d3.max(events.map(function(d){return d.radius})) || cfg.radius)*1.5+cfg.lineWidth;
    var step = (cfg.horizontalLayout)?((cfg.width-2*margin2)/(maxValue - minValue)):((cfg.height-2*margin2)/(maxValue - minValue));
    var series = [];
    if(maxValue == minValue){step = 0;if(cfg.horizontalLayout){margin2=cfg.width/2}else{margin2=cfg.height/2}}

    linePrevious = {
      x1 : null,
      x2 : null,
      y1 : null,
      y2 : null
    };
    
    events.sort(function (a, b) {
      return d3.descending(a.date, b.date);
    });

    g.selectAll("line")
    .data(events).enter().append("line")
    .attr("class", "timeline-line")
      .attr("x1", function(d){
                       console.log(d.value);
                      var ret;
                      if(cfg.horizontalLayout){
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue) + margin2)
                      }
                      else{
                        ret = Math.floor(cfg.width/2)
                      }
                      linePrevious.x1 = ret
                      return ret
                      })
    .attr("x2", function(d){
                      if (linePrevious.x1 != null){
                          return linePrevious.x1
                      }
                      if(cfg.horizontalLayout){
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue ))
                      }
                      return Math.floor(g_width/2)
                      })
    .attr("y1", function(d){
                      var ret;
                      if(cfg.horizontalLayout){
                        ret = Math.floor(cfg.height/2)
                      }
                      else{
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue)) + margin2
                      }
                      linePrevious.y1 = ret
                      return ret
                      })
    .attr("y2", function(d){
                      if (linePrevious.y1 != null){
                        return linePrevious.y1
                      }
                      if(cfg.horizontalLayout){
                        return Math.floor(cfg.height/2)
                      }
                      var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                      return Math.floor(step*(datum - minValue))
                      })
    .style("stroke", function(d){
                      if(d.color != undefined){
                        return d.color
                      }
                      if(d.series != undefined){
                        if(series.indexOf(d.series) < 0){
                          series.push(d.series);
                        }
                        return cfg.seriesColor(series.indexOf(d.series));
                      }
                      return cfg.color})
    .style("stroke-width", cfg.lineWidth);

    
   
    var knot = g.selectAll(".knot")
    .data(events).enter()
    .append('g')
    .attr('class', 'knot')
    .each(function (d, i) {
      d.sign = i % 2 ? 1 : -1;
      if(cfg.horizontalLayout){
          var datum = (cfg.dateDimension) ? new Date(d.date).getTime():d.value;
          var x=  Math.floor(step*(datum - minValue) + margin2);
          d.x = x;
        } else {
        d.x = Math.floor(cfg.width/2);
        }
      if(cfg.horizontalLayout){
          d.y = Math.floor(cfg.height/2);
        } else {
        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
        d.y = Math.floor(step*(datum - minValue) + margin2);
        }
    });
    
    knot.append('line')
        .attr('x1', function (d) {
          return d.x;
        })
        .attr('y1', function (d) {
          return d.y;
        })
        .attr('x2', function (d) {
          return d.x;
        })
        .attr('y2', function (d) {
          
          return d.y - 100 * d.sign ;
        })
        .attr('stroke', '#666')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
        
    knot
        .append('image')
        .attr('href', function (d) {
          return d.img;
        })
        .attr('x', function (d) {
          return d.x - 50;
        })
        .attr('y', function (d) {
          return d.y - (d.sign === 1 ? 200 : -100); //判断图片高度，更改
        })
        .attr('width', 100) //可调长宽接口
        .attr('height', 100);
    
    knot.append('text')
        .attr('x', function (d) {
          return d.x;
        })
        .attr('y', function (d) {
          return d.y - 80 * d.sign;
        })
        .text(function (d) {
          return d.name;
        })
        .attr('fill', '#fff')
        .attr('font-size', 10)
        .attr('text-anchor', 'middle');

    
    knot
    .append("circle")
    .attr("class", "timeline-event")
    .attr("r", function(d){if(d.radius != undefined){return d.radius} return cfg.radius})
    .style("stroke", function(d){
                    if(d.color != undefined){
                      return d.color;
                    }
                    if(d.series != undefined){
                      if(series.indexOf(d.series) < 0){
                        series.push(d.series);
                      }
                      
                      return cfg.seriesColor(series.indexOf(d.series));
                    }
                    return cfg.color}
    )
    .style("stroke-width", function(d){if(d.lineWidth != undefined){return d.lineWidth} return cfg.lineWidth})
    .style("fill", function(d){if(cfg.circleColor != undefined){return cfg.circleColor} return cfg.circleColor})
    .attr("cy", function(d){
        return d.y;
    })
    .attr("cx", function(d){
        return d.x;
    })
    // .on("mouseover", function(d){
    //   if(cfg.dateDimension){
    //     var format = d3.time.format(cfg.dateFormat);
    //     var datetime = format(new Date(d.date));
    //     var dateValue = (datetime != "")?(d.name +" <small>("+datetime+")</small>"):d.name;
    //   }else{
    //     var format = function(d){return d}; // TODO
    //     var datetime = d.value;
    //     var dateValue = d.name +" <small>("+d.value+")</small>";
    //   }
      
    //   d3.select(this)
    //   .style("fill", function(d){if(d.color != undefined){return d.color} return cfg.color}).transition()
    //   .duration(100).attr("r",  function(d){if(d.radius != undefined){return Math.floor(d.radius*1.5)} return Math.floor(cfg.radius*1.5)});
    //   tip.html("");
    //   if(d.img != undefined){
    //     tip.append("img").style("float", "left").style("margin-right", "4px").attr("src", d.img).attr("width", "64px").attr("border-radius","10px");
    //   }
    //   tip.append("div").style("float", "left").html(dateValue );
    //   tip.transition()
    //   .duration(100)
    //   .style("opacity", cfg.tipOpacity);

    // })
    // .on("mouseout", function(){
    //     d3.select(this)
    //     .style("fill", function(d){if(d.background != undefined){return d.background} return cfg.background}).transition()
    //     .duration(100).attr("r", function(d){if(d.radius != undefined){return d.radius} return cfg.radius});
    //     tip.transition()
    //     .duration(100)
    // .style("opacity", 0)});


    //Adding start and end labels
    if(cfg.showLabels != false){
      if(cfg.dateDimension){
        var format = d3.time.format(cfg.labelFormat);
        var startString = format(new Date(minValue));
        var endString = format(new Date(maxValue));
      }else{
        var format = function(d){return d}; //Should I do something else?
        var startString = minValue;
        var endString = maxValue;
      }
      g.append("text")
         .text(startString).style("font-size","70%").style("stroke","#fff")
         .attr("x", function(d){if(cfg.horizontalLayout){return d3.max([0, (margin2-this.getBBox().width/2)])-10} return Math.floor(this.getBBox().width/2)-10})
         .attr("y", function(d){if(cfg.horizontalLayout){return Math.floor(cfg.height/2+(margin2+this.getBBox().height))-35}return margin2+this.getBBox().height/2-35})
         .attr("text-anchor","end")

      g.append("text")
         .text(endString).style("font-size", "70%").style("stroke","#fff")
         .attr("x", function(d){if(cfg.horizontalLayout){return  cfg.width -  d3.max([this.getBBox().width, (margin2+this.getBBox().width/2)])+10} return Math.floor(this.getBBox().width/2)+10})
         .attr("y", function(d){if(cfg.horizontalLayout){return Math.floor(cfg.height/2+(margin2+this.getBBox().height))-35}return cfg.height-margin2+this.getBBox().height/2-35})
         .attr("text-anchor","start")
        
    }


    // svg.on("mousemove", function(){
    //     tipPixels = parseInt(tip.style("height").replace("px", ""));
    // // return tip.style("top", (d3.event.pageY-tipPixels-margin2)+"px").style("left",(d3.event.pageX+20)+"px");})
    // // .on("mouseout", function(){return tip.style("opacity", 0).style("top,"0px").style("left","0px");});
    // // // d3.select(".remove").remove();
  }


    

};

