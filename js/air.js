/**
 * Created by Administrator on 2016/7/16.
 */
//全局变量
var width = 550;	//SVG绘制区域的宽度
var height = 250;	//SVG绘制区域的高度
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.0);
var padding = {top: 25, right: 50, bottom: 0, left: 50};//外边框
var addair = 0;
var airflag = 0;
var airsvg = d3.select("#svg_area")			//选择<body>
    .append("svg")			//在<body>中添加<svg>
    .attr("id", "air")
    .attr("width", 800)	//设定<svg>的宽度属性
    .attr("height", 270);//设定<svg>的高度属性
var subairsvg = d3.select("#air")
    .append("svg")
    .attr("id", "subair")
    .attr("width", 600)
    .attr("height", 270);




var airname = ["SO2", "NO2", "CO", "O3", "PM10", "PM2.5", "AQI"];
//定义颜色比例尺
var aircolor =["#993333","#0066CC","#009966","#9933FF","#666600","tomato","pink"];


function drawAirG() {
    d3.select("#subair").selectAll("*").remove();
    var showtime;//用来记录当前时间的年与日无时
    var pos = time.indexOf(' ');
    showtime = time.substr(0, pos);
    var airdata;
    airdata = new Array(7);
    for(var i = 0; i < airdata.length; i ++){
        airdata[i] = new Array(24);
    }
    for(var i = 0; i < airdata.length; i ++){
        for(var j = 0; j < airdata[0].length; j ++){
            airdata[i][j] = 0;
        }
    }
    for(var i = 0; i < airData.length; i ++){
        pos = airData[i][23].indexOf(' ');
        var timebig = airData[i][23].substr(0, pos);
        var timesmall = airData[i][23].substr(pos + 1, airData[i][23].indexOf(':') - pos);
        if(showtime == timebig && airData[i][5] == '1151A'){
            timesmall = parseInt(timesmall, 10);
            airdata[0][timesmall] = Number(airData[i][9]);
            airdata[1][timesmall] = Number(airData[i][11]);
            airdata[2][timesmall] = Number(airData[i][13]);
            airdata[3][timesmall] = Number(airData[i][15]);
            airdata[4][timesmall] = Number(airData[i][19]);
            airdata[5][timesmall] = Number(airData[i][21]);
            airdata[6][timesmall] = Number(airData[i][6]);
        }
    }


//定义一组方形

    d3.select("#rectflag").remove();
    var airrect = airsvg.append("g").attr("id", "rectflag")
        .selectAll("rect")
        .data(airname)
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
            if (i == airflag) {
                return 1;
            } else {
                return 0;
            }
        })
        .on("mousemove", function (d) {
            d3.select(this).attr("cursor", "pointer");//这里设置光标的显示的方式
        })
        .on("click", function (d, i) {
            airflag = i;
            if (addair == 0) {
                d3.select("#subair").selectAll("*").remove();
                showairpath(airflag);
            }
            if (addair > 0) {
                AddairData(-1, -1);
        }
        d3.select(this).attr("fill-opacity", 1);
        d3.select("#rectflag").selectAll("rect").filter(function (c) {
            return c != d;
        }).attr("fill-opacity", 0);
    });
    //定义一组文字
    var airtext = airsvg.selectAll("text")
        .data(airname)
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
    var text=airsvg.append("text").attr("x",10).attr("y",15).attr("fill","gray").text("空气监测");
    var text=airsvg.append("text").attr("x",510).attr("y",265).attr("fill","gray").text("单位/小时");
    showairpath(airflag);

    function showairpath(j) {
//计算最大值
        var amountmax = d3.max(airdata[j]);


        var xScale = d3.scale.linear()
            .domain([0, airdata[j].length])
            .range([0, width - padding.left - padding.right]);

        var yScale = d3.scale.linear()
            .domain([0, amountmax])
            .range([height - padding.top - padding.bottom, 0]);


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
        subairsvg.append("path")
            .attr("d", linePath(airdata[j]))
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", aircolor[0]);

//在路径的节点上添加小圆点
        var circles = subairsvg.selectAll("circle")
            .data(airdata[j])
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
                    .html(airname[airflag] + ":" + d);
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

        subairsvg.append("g")
            .attr("class", "xaxis")
            .attr("id", "idx")
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
            .call(xAxis);

        subairsvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .call(yAxis);
        //这里添加鼠标的缩放功能先留着不管
        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 1.2])
            .on("zoom", zoomed);

        airsvg.call(zoom);

        function zoomed() {
            console.log(d3.event.scale);
            if (d3.event.scale > 1.1) {
                d3.select("#subair").select(".xaxis").remove();
                var xScale = d3.scale.linear()
                    .domain([0, 7])
                    .range([0, width - padding.left - padding.right]);
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                subairsvg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                    .call(xAxis);
                //console.log(10);
            }
            if (d3.event.scale < 1.1) {
                d3.select("#subair").select(".xaxis").remove();
                var xScale = d3.scale.linear()
                    .domain([0, 24])
                    .range([0, width - padding.left - padding.right]);
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                subairsvg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                    .call(xAxis);
                //console.log(10);
            }
        }
    }


}
var arrayAirData = [];
var arrayAirLngLat = [];
function AddairData(lng, lat) {
    d3.select("#subair").selectAll("*").remove();
    if(lng != -1 && lat != -1){
        var showtime;//用来记录当前时间的年与日无时
        var pos = time.indexOf(' ');
        showtime = time.substr(0, pos);
        if(lng == 0 && lat == 0){
            arrayAirData = [];
            for(var z = 0; z < arrayAirLngLat.length; z ++){
                var airdata;
                airdata = new Array(7);
                for(var i = 0; i < airdata.length; i ++){
                    airdata[i] = new Array(24);
                }
                for(var i = 0; i < airdata.length; i ++){
                    for(var j = 0; j < airdata[0].length; j ++){
                        airdata[i][j] = 0;
                    }
                }
                for(var i = 0; i < airData.length; i ++){
                    pos = airData[i][23].indexOf(' ');
                    var timebig = airData[i][23].substr(0, pos);
                    var timesmall = airData[i][23].substr(pos + 1, airData[i][23].indexOf(':') - pos);
                    if(showtime == timebig && airData[i][24] == arrayAirLngLat[z][0] && airData[i][25] == arrayAirLngLat[z][1]) {
                        timesmall = parseInt(timesmall, 10);
                        airdata[0][timesmall] = Number(airData[i][9]);
                        airdata[1][timesmall] = Number(airData[i][11]);
                        airdata[2][timesmall] = Number(airData[i][13]);
                        airdata[3][timesmall] = Number(airData[i][15]);
                        airdata[4][timesmall] = Number(airData[i][19]);
                        airdata[5][timesmall] = Number(airData[i][21]);
                        airdata[6][timesmall] = Number(airData[i][6]);
                    }
                }
                arrayAirData.push(airdata);
            }
        }
        else {
            var airdata;
            airdata = new Array(7);
            for(var i = 0; i < airdata.length; i ++){
                airdata[i] = new Array(24);
            }
            for (var i = 0; i < airdata.length; i++) {
                for (var j = 0; j < airdata[0].length; j++) {
                    airdata[i][j] = 0;
                }
            }
            for (var i = 0; i < airData.length; i++) {
                pos = airData[i][23].indexOf(' ');
                var timebig = airData[i][23].substr(0, pos);
                var timesmall = airData[i][23].substr(pos + 1, airData[i][23].indexOf(':') - pos);
                if (showtime == timebig && airData[i][24] == lng && airData[i][25] == lat) {
                    timesmall = parseInt(timesmall, 10);
                    airdata[0][timesmall] = Number(airData[i][9]);
                    airdata[1][timesmall] = Number(airData[i][11]);
                    airdata[2][timesmall] = Number(airData[i][13]);
                    airdata[3][timesmall] = Number(airData[i][15]);
                    airdata[4][timesmall] = Number(airData[i][19]);
                    airdata[5][timesmall] = Number(airData[i][21]);
                    airdata[6][timesmall] = Number(airData[i][6]);
                }
            }
            //console.log(airdata);
            arrayAirLngLat.push([lng, lat]);
            arrayAirData.push(airdata);
        }
    }

    //计算最大值
    var amountmax = 0;
    for(var i = 0; i < arrayAirData.length; i ++){
        var m = d3.max(arrayAirData[i][airflag]);
        if(amountmax < m){
            amountmax = m;
        }
    }
    var xScale = d3.scale.linear()
        .domain([0, arrayAirData[0][0].length])
        .range([0, width - padding.left - padding.right]);

    var yScale = d3.scale.linear()
        .domain([0, amountmax])
        .range([height - padding.top - padding.bottom, 0]);
    //y轴
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    subairsvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    subairsvg.append("g")
        .attr("class", "xaxis")
        .attr("id", "idx")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);

    //创建一个直线生成器
    var linePath = d3.svg.line()
        .interpolate("linear")
        .x(function (d, i) {
            return xScale(i) + padding.left;
        })
        .y(function (d) {
            return yScale(d) + padding.top;
        });

    for(var i = 0; i < arrayAirData.length; i ++){
        //添加路径
        subairsvg.append("path")
            .attr("d", linePath(arrayAirData[i][airflag]))
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", aircolor[i % 7]);
        for (var j = 0; j < arrayAirData[i][0].length; j++) {
            var cilrcle = subairsvg.append("circle")
                .attr("cx", (xScale(j) + padding.left))
                .attr("cy", (yScale(arrayAirData[i][airflag][j]) + padding.top))
                .attr("r", 2)
                .attr("fill", "#EEEEEE")
                .attr("stroke", "gray")
                .attr("stroke-width", 2)
                .on("mouseout", function (d) {
                    tooltip.style("opacity", 0.0);
                });
            test(cilrcle, arrayAirData[i][airflag][j]);
        }
    }
}

function test(circle, d){
    circle.on("mouseover", function(){
        d3.select(this).attr("cursor", "pointer");//这里设置光标的显示的方式
        tooltip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity", 1.0)
            .html(airname[airflag]+ ":" + d);
    });
}


