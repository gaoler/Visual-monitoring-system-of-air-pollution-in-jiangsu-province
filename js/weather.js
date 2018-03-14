/**
 * Created by Administrator on 2016/7/16.
 */
var weaflag = 0;
var addwea = 0;
var weasvg = d3.select("#svg_area")			//选择<body>
    .append("svg")			//在<body>中添加<svg>
    .attr("id", "wea")
    .attr("width", 800)	//设定<svg>的宽度属性
    .attr("height", 270);//设定<svg>的高度属性
var subweasvg = d3.select("#wea")
    .append("svg")
    .attr("id", "subwea")
    .attr("width", 600)
    .attr("height", 270);

var weaname=["降水量/mm","温度/℃","相对湿度"];
//定义颜色比例尺
var weacolor =["#993333","#0066CC","#009966","#9933FF","#666600","tomato","pink"];

function drawRain() {
    d3.select("#subwea").selectAll("*").remove();
    var showtime;//用来记录当前时间的年与日无时
    showtime = timeRain.substr(0, 8);
    var weadata;
    weadata = new Array(3);
    for(var i = 0; i < weadata.length; i ++){
        weadata[i] = new Array(24);
    }
    for(var i = 0; i < weadata.length; i ++){
        for(var j = 0; j < weadata[0].length; j ++){
            weadata[i][j] = 0;
        }
    }
    for(var i = 0; i < rainData.length; i ++){
        var timebig = rainData[i][3].substr(0, 8);
        var timesmall = rainData[i][3].substr(8, 2);
        if(showtime == timebig && rainData[i][2] == '张家港'){
            timesmall = parseInt(timesmall, 10);
            if(Number(rainData[i][6]) < 5000) {
                weadata[0][timesmall] = Number(rainData[i][6]);
            }
            if(Number(rainData[i][4]) < 5000) {
                weadata[1][timesmall] = Number(rainData[i][4]);
            }
            if(Number(rainData[i][5]) < 5000) {
                weadata[2][timesmall] = Number(rainData[i][5]);
            }
        }
    }


//定义一组方形
//定义一组方形
    d3.select("#rectflag2").remove();
    var wearect = weasvg.append("g").attr("id", "rectflag2")
        .selectAll("rect")
        .data(weaname)
        .enter()
        .append("rect")
        .attr("x", 650)
        .attr("y", function (d, i) {
            return 20 + i * 30;
        })
        .attr("width", 20)
        .attr("height", 10)
        .attr("stroke", function (d, i) {
            return "gray";
        })
        .attr("stroke-width", 1)
        .attr("fill", function (d, i) {
            return "red";
        })
        .attr("fill-opacity", function (d, i) {
            if (i == weaflag) {
                return 1;
            } else {
                return 0;
            }
        })
        .on("mousemove", function (d) {
            d3.select(this).attr("cursor", "pointer");//这里设置光标的显示的方式
        })
        .on("click", function (d, i) {
            weaflag = i;
            if (addwea == 0) {
                d3.select("#subwea").selectAll("*").remove();
                showweapath(weaflag);
            }
            if (addwea > 0) {
                AddweaData(-1, -1);
            }
            d3.select(this).attr("fill-opacity", 1);
            d3.select("#rectflag2").selectAll("rect").filter(function (c) {
                return c != d;
            }).attr("fill-opacity", 0);
        });

//定义一组文字
    var weatext = weasvg.selectAll("text")
        .data(weaname)
        .enter()
        .append("text")
        .attr("x", 650)
        .attr("y", function (d, i) {
            return 20 + i * 30;
        })
        .attr("dx", 25)
        .attr("dy", ".7em")
        .attr("fill", "black")
        .text(function (d) {
            return d;
        });

    var text=weasvg.append("text").attr("x",10).attr("y",15).attr("fill","gray").text("天气状况");
    var text=weasvg.append("text").attr("x",510).attr("y",265).attr("fill","gray").text("单位/小时");

    showweapath(weaflag);

    function showweapath(j) {
//计算最大值
        var amountmax = d3.max(weadata[j]);

        var xScale = d3.scale.linear()
            .domain([0, weadata[j].length])
            .range([0, width - padding.left - padding.right]);

        var yScale = d3.scale.linear()
            .domain([0, amountmax])
            .range([height - padding.top - padding.bottom, 0]);

        if (j == 1) {
            yScale.domain([d3.min(weadata[j]), d3.max(weadata[j]) * 1.1]);
        }


//创建一个直线生成器

        var linePath = d3.svg.line()
            .interpolate("linear")
            .x(function (d, i) {
                return xScale(i) + padding.left;
            })
            .y(function (d) {
                return yScale(d) + padding.top;
            });

//添加路径
        subweasvg.append("path")
            .attr("d", linePath(weadata[j]))
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", weacolor[0]);

//在路径的节点上添加小圆点
        var circles = subweasvg.selectAll("circle")
            .data(weadata[j])
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return xScale(i) + padding.left;
            })
            .attr("cy", function (d) {
                return yScale(d) + padding.top;
            })
            .attr("r", 2)
            .attr("fill", "#EEEEEE")
            .attr("stroke", "gray")
            .attr("stroke-width", 2)
            .on("mouseover", function (d, i) {
                d3.select(this).attr("cursor", "pointer");//这里设置光标的显示的方式
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0)
                    .html(weaname[weaflag] + ":" + d);
            })
            .on("mouseout", function (d) {
                tooltip.style("opacity", 0.0);
            });

//x轴
        var xAxis = d3.svg.axis()
            .scale(xScale)
            //.ticks(24)
            //.tickFormat(d3.format("d"))
            .orient("bottom");

//y轴
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        subweasvg.append("g")
            .attr("class", "xaxis")
            .attr("id", "idx")
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
            .call(xAxis);

        subweasvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .call(yAxis);
        //这里添加鼠标的缩放功能先留着不管
        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 1.2])
            .on("zoom", zoomed);

        weasvg.call(zoom);

        function zoomed() {
            console.log(d3.event.scale);
            if (d3.event.scale > 1.1) {
                d3.select("#subwea").select(".xaxis").remove();
                var xScale = d3.scale.linear()
                    .domain([0, 7])
                    .range([0, width - padding.left - padding.right]);
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                subweasvg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                    .call(xAxis);
                console.log(10);
            }
            if (d3.event.scale < 1.1) {
                d3.select("#subwea").select(".xaxis").remove();
                var xScale = d3.scale.linear()
                    .domain([0, 24])
                    .range([0, width - padding.left - padding.right]);
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                subweasvg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                    .call(xAxis);
                console.log(10);
            }
        }
    }
}
var arrayRainData = [];
var arrayRainLngLat = [];
function AddweaData(lng, lat){
    d3.select("#subwea").selectAll("*").remove();
    if(lng != -1 && lat != -1) {
        var showtime;//用来记录当前时间的年与日无时
        showtime = timeRain.substr(0, 7);
        if(lng == 0 && lat == 0){
            arrayRainData = [];
            for(var z = 0; z < arrayRainLngLat.length; z ++) {
                var weadata;
                weadata = new Array(3);
                for (var i = 0; i < weadata.length; i++) {
                    weadata[i] = new Array(24);
                }
                for (var i = 0; i < weadata.length; i++) {
                    for (var j = 0; j < weadata[0].length; j++) {
                        weadata[i][j] = 0;
                    }
                }
                for (var i = 0; i < rainData.length; i++) {
                    var timebig = rainData[i][3].substr(0, 7);
                    var timesmall = rainData[i][3].substr(8, 2);
                    if (showtime == timebig && rainData[i][9] == arrayRainLngLat[z][0] && rainData[i][10] == arrayRainLngLat[z][1]) {
                        timesmall = parseInt(timesmall, 10);
                        if (Number(rainData[i][6]) < 5000) {
                            weadata[0][timesmall] = Number(rainData[i][6]);
                        }
                        if (Number(rainData[i][4]) < 5000) {
                            weadata[1][timesmall] = Number(rainData[i][4]);
                        }
                        if (Number(rainData[i][5]) < 5000) {
                            weadata[2][timesmall] = Number(rainData[i][5]);
                        }
                    }
                }
                arrayRainData.push(weadata);
            }
        }
        else {
            var weadata;
            weadata = new Array(3);
            for (var i = 0; i < weadata.length; i++) {
                weadata[i] = new Array(24);
            }
            for (var i = 0; i < weadata.length; i++) {
                for (var j = 0; j < weadata[0].length; j++) {
                    weadata[i][j] = 0;
                }
            }
            for (var i = 0; i < rainData.length; i++) {
                var timebig = rainData[i][3].substr(0, 7);
                var timesmall = rainData[i][3].substr(8, 2);
                if (showtime == timebig && rainData[i][9] == lng && rainData[i][10] == lat) {
                    timesmall = parseInt(timesmall, 10);
                    if (Number(rainData[i][6]) < 5000) {
                        weadata[0][timesmall] = Number(rainData[i][6]);
                    }
                    if (Number(rainData[i][4]) < 5000) {
                        weadata[1][timesmall] = Number(rainData[i][4]);
                    }
                    if (Number(rainData[i][5]) < 5000) {
                        weadata[2][timesmall] = Number(rainData[i][5]);
                    }
                }
            }
            arrayRainData.push(weadata);
            arrayRainLngLat.push([lng,lat]);
        }
    }
    var amountmax = 0;
    var amountmin = 0;
    for(var i = 0; i < arrayRainData.length; i ++){
        var m = d3.max(arrayRainData[i][weaflag]);
        if(amountmax < m){
            amountmax = m;
        }
        var m = d3.min(arrayRainData[i][weaflag]);
        if(amountmin > m){
            amountmin = m;
        }
    }


    var xScale = d3.scale.linear()
        .domain([0, arrayRainData[0][0].length])
        .range([0, width - padding.left - padding.right]);

    var yScale = d3.scale.linear()
        .domain([0, amountmax])
        .range([height - padding.top - padding.bottom, 0]);
    if (weaflag == 1) {
        yScale.domain([amountmin, amountmax]);
    }
    //y轴
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    subweasvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    subweasvg.append("g")
        .attr("class", "xaxis")
        .attr("id","idx")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);

    //创建一个直线生成器
    var linePath = d3.svg.line()
        .interpolate("linear")
        .x(function (d, i) {
            return xScale(i) + padding.left;
        })
        .y(function (d){
            return yScale(d) + padding.top;
        });

    for(var i = 0; i < arrayRainData.length; i ++) {
        //添加路径
        subweasvg.append("path")
            .attr("d", linePath(arrayRainData[i][weaflag]))
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", weacolor[i % 7]);
        for(var j = 0; j < arrayRainData[i][0].length; j++) {
            var cilrcle = subweasvg.append("circle")
                .attr("cx", (xScale(j) + padding.left))
                .attr("cy", (yScale(arrayRainData[i][weaflag][j]) + padding.top))
                .attr("r", 2)
                .attr("fill", "#EEEEEE")
                .attr("stroke", "gray")
                .attr("stroke-width", 2)
                .on("mouseout",function (d) {
                    tooltip.style("opacity",0.0);
                });
            weacircleLister(cilrcle, arrayRainData[i][weaflag][j]);
        }
    }
}
function weacircleLister(circle, d){
    circle.on("mouseover", function(){
        d3.select(this).attr("cursor", "pointer");//这里设置光标的显示的方式
        tooltip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity", 1.0)
            .html(weaname[weaflag]+ ":" + d);
    });
}