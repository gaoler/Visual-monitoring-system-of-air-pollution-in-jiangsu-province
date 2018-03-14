/**
 * Created by Administrator on 2016/7/16.
 */

var entflag = 0;
var addent = 0;

var entsvg = d3.select("#svg_area")			//选择<body>
    .append("svg")			//在<body>中添加<svg>
    .attr("id", "ent")
    .attr("width", 800)	//设定<svg>的宽度属性
    .attr("height", 270);//设定<svg>的高度属性
var subentsvg = d3.select("#ent")
    .append("svg")
    .attr("id", "subent")
    .attr("width", 600)
    .attr("height", 270);

var entname = ["SO2", "SO2折算", "NO2", "NO2折算", "Dust", "Dust折算"];


//定义颜色比例尺
var entcolor =["#993333","#0066CC","#009966","#9933FF","#666600","tomato","pink"];

function drawEnterprise() {
    d3.select("#subent").selectAll("*").remove();
    var showtime;//用来记录当前时间的年与日无时
    var pos = time.indexOf(' ');
    showtime = time.substr(0, pos);
    var entdata;
    entdata = new Array(6);
    for(var i = 0; i < entdata.length; i ++){
        entdata[i] = new Array(24);
    }
    for(var i = 0; i < entdata.length; i ++){
        for(var j = 0; j < entdata[0].length; j ++){
            entdata[i][j] = 0;
        }
    }
    for(var i = 0; i < pollutionData.length; i ++){
        pos = pollutionData[i][0].indexOf(' ');
        var timebig = pollutionData[i][0].substr(0, pos);
        var timesmall = pollutionData[i][0].substr(pos + 1, pollutionData[i][0].indexOf(':') - pos);
        if(showtime == timebig && pollutionData[i][2] == '南京中联水泥有限公司'){
            timesmall = parseInt(timesmall, 10);
            entdata[0][timesmall] = Number(pollutionData[i][9]);
            entdata[1][timesmall] = Number(pollutionData[i][10]);
            entdata[2][timesmall] = Number(pollutionData[i][11]);
            entdata[3][timesmall] = Number(pollutionData[i][12]);
            entdata[4][timesmall] = Number(pollutionData[i][13]);
            entdata[5][timesmall] = Number(pollutionData[i][14]);
        }
    }
//这里初始数据，在循环传入数据时写成这样的格式


//定义一组方形
    d3.select("#rectflag1").remove();
    var entrect = entsvg.append("g").attr("id", "rectflag1")
        .selectAll("rect")
        .data(entname)
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
            if (i == entflag) {
                return 1;
            } else {
                return 0;
            }
        })
        .on("mousemove", function (d) {
            d3.select(this).attr("cursor", "pointer");//这里设置光标的显示的方式
        })
        .on("click", function (d, i) {
            entflag = i;
            if (addent == 0) {
                d3.select("#subent").selectAll("*").remove();
                showentpath(entflag);
            }
            if (addent > 0) {
                AddentData(-1, -1);
            }
            d3.select(this).attr("fill-opacity", 1);
            d3.select("#rectflag1").selectAll("rect").filter(function (c) {
                return c != d;
            }).attr("fill-opacity", 0);
        });

//定义一组文字
    var enttext = entsvg.selectAll("text")
        .data(entname)
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
    var text=entsvg.append("text").attr("x",10).attr("y",15).attr("fill","gray").text("企业排污");
    var text=entsvg.append("text").attr("x",510).attr("y",265).attr("fill","gray").text("单位/小时");

    showentpath(entflag);

    function showentpath(j) {

//计算最大值
        var amountmax = d3.max(entdata[j]);


        var xScale = d3.scale.linear()
            .domain([0, entdata[j].length])
            .range([0, width - padding.left - padding.right]);

        var yScale = d3.scale.linear()
            .domain([0, amountmax * 1.1])
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
        subentsvg.append("path")
            .attr("d", linePath(entdata[j]))
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", entcolor[0]);

//在路径的节点上添加小圆点
        var circles = subentsvg.selectAll("circle")
            .data(entdata[j])
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
                    .html(entname[entflag] + ":" + d);
            })
            .on("mouseout", function (d) {
                tooltip.style("opacity", 0.0);
            });
//x轴
        var xAxis = d3.svg.axis()
            .scale(xScale)
            //.ticks(5)
            //.tickFormat(d3.format("d"))
            .orient("bottom");

//y轴
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        subentsvg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
            .call(xAxis);

        subentsvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .call(yAxis);

        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 1.2])
            .on("zoom", zoomed);

        entsvg.call(zoom);

        function zoomed() {
            console.log(d3.event.scale);
            if (d3.event.scale > 1.1) {
                d3.select("#subent").select(".xaxis").remove();
                var xScale = d3.scale.linear()
                    .domain([0, 7])
                    .range([0, width - padding.left - padding.right]);
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                subentsvg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                    .call(xAxis);
                console.log(10);
            }
            if (d3.event.scale < 1.1) {
                d3.select("#subent").select(".xaxis").remove();
                var xScale = d3.scale.linear()
                    .domain([0, 24])
                    .range([0, width - padding.left - padding.right]);
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                subentsvg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                    .call(xAxis);
                console.log(10);
            }
        }
    }
}
var arrayPollutionData = [];
var arrayPollutionLngLat = [];
function AddentData(lng, lat){
    d3.select("#subent").selectAll("*").remove();
    //这里添加数据需要循环
    if(lng != -1 && lat != -1) {
        var showtime;//用来记录当前时间的年与日无时
        var pos = time.indexOf(' ');
        showtime = time.substr(0, pos);
        if(lng == 0 && lat == 0) {
            arrayPollutionData = [];
            for(var z = 0; z < arrayPollutionLngLat.length; z ++) {
                var entdata;
                entdata = new Array(6);
                for (var i = 0; i < entdata.length; i++) {
                    entdata[i] = new Array(24);
                }
                for (var i = 0; i < entdata.length; i++) {
                    for (var j = 0; j < entdata[0].length; j++) {
                        entdata[i][j] = 0;
                    }
                }
                for (var i = 0; i < pollutionData.length; i++) {
                    pos = pollutionData[i][0].indexOf(' ');
                    var timebig = pollutionData[i][0].substr(0, pos);
                    var timesmall = pollutionData[i][0].substr(pos + 1, pollutionData[i][0].indexOf(':') - pos);
                    if (showtime == timebig && pollutionData[i][21] == arrayPollutionLngLat[z][0] && pollutionData[i][22] == arrayPollutionLngLat[z][1]) {
                        timesmall = parseInt(timesmall, 10);
                        entdata[0][timesmall] = Number(pollutionData[i][9]);
                        entdata[1][timesmall] = Number(pollutionData[i][10]);
                        entdata[2][timesmall] = Number(pollutionData[i][11]);
                        entdata[3][timesmall] = Number(pollutionData[i][12]);
                        entdata[4][timesmall] = Number(pollutionData[i][13]);
                        entdata[5][timesmall] = Number(pollutionData[i][14]);
                    }
                }
                arrayPollutionData.push(entdata);
            }
        }
        else
        {
            var entdata;
            entdata = new Array(6);
            for (var i = 0; i < entdata.length; i++) {
                entdata[i] = new Array(24);
            }
            for (var i = 0; i < entdata.length; i++) {
                for (var j = 0; j < entdata[0].length; j++) {
                    entdata[i][j] = 0;
                }
            }
            for (var i = 0; i < pollutionData.length; i++) {
                pos = pollutionData[i][0].indexOf(' ');
                var timebig = pollutionData[i][0].substr(0, pos);
                var timesmall = pollutionData[i][0].substr(pos + 1, pollutionData[i][0].indexOf(':') - pos);
                if (showtime == timebig && pollutionData[i][21] == lng && pollutionData[i][22] == lat) {
                    timesmall = parseInt(timesmall, 10);
                    entdata[0][timesmall] = Number(pollutionData[i][9]);
                    entdata[1][timesmall] = Number(pollutionData[i][10]);
                    entdata[2][timesmall] = Number(pollutionData[i][11]);
                    entdata[3][timesmall] = Number(pollutionData[i][12]);
                    entdata[4][timesmall] = Number(pollutionData[i][13]);
                    entdata[5][timesmall] = Number(pollutionData[i][14]);
                }
            }
            console.log(entdata[0]);
            arrayPollutionData.push(entdata);
            arrayPollutionLngLat.push([lng, lat]);
        }
    }

    var amountmax = 0;
    for(var i = 0; i < arrayPollutionData.length; i ++){
        var m = d3.max(arrayPollutionData[i][entflag]);
        if(amountmax < m){
            amountmax = m;
        }
    }

    var xScale = d3.scale.linear()
        .domain([0, arrayPollutionData[0][0].length])
        .range([0, width - padding.left - padding.right]);

    var yScale = d3.scale.linear()
        .domain([0, amountmax])
        .range([height - padding.top - padding.bottom, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        //.ticks(5)
        //.tickFormat(d3.format("d"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    subentsvg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);

    subentsvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis);
    //创建一个直线生成器
    var linePath = d3.svg.line()
        .interpolate("linear")
        .x(function (d, i) {
            return xScale(i) + padding.left;
        })
        .y(function (d) {
            return yScale(d) + padding.top;
        });

    for(var i = 0; i < arrayPollutionData.length; i ++){
        //添加路径
        subentsvg.append("path")
            .attr("d", linePath(arrayPollutionData[i][entflag]))
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", entcolor[i % 7]);
        for(var j=0;j<arrayPollutionData[i][0].length;j++) {
            var cilrcle = subentsvg.append("circle")
                .attr("cx", (xScale(j) + padding.left))
                .attr("cy", (yScale(arrayPollutionData[i][entflag][j]) + padding.top))
                .attr("r", 2)
                .attr("fill", "#EEEEEE")
                .attr("stroke", "gray")
                .attr("stroke-width", 2)
                .on("mouseover",function(d,i){
                    d3.select(this).attr("cursor","pointer");//这里设置光标的显示的方式
                    tooltip.style("left",(d3.event.pageX)+"px")
                        .style("top",(d3.event.pageY+20)+"px")
                        .style("opacity",1.0);
                })
                .on("mouseout",function (d) {
                    tooltip.style("opacity",0.0);
                });
            entcircleLister(cilrcle, arrayPollutionData[i][entflag][j]);
        }
    }
}
function entcircleLister(circle, d){
    circle.on("mouseover", function(){
        d3.select(this).attr("cursor", "pointer");//这里设置光标的显示的方式
        tooltip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity", 1.0)
            .html(entname[entflag]+ ":" + d);
    });
}