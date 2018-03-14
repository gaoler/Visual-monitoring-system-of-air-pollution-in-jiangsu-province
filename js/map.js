/**
 * Created by Administrator on 2016/7/19.
 */
var buttonStyle = 0;//��ť������
var airData = [];//�洢�����������
var pollutionData = [];//�洢��������
var rainData = [];//�洢��������
var time = "2015/12/1 0:00";//��¼��ǰ��ʱ�䣬���ҳ�ʼ��
var timeRain = "2015120100";
var heatmapOverlay;//����ͼ����
var heat1, heat2;
var map;//��ͼ����
var map1, map2, map3
var controlflag=null;


function readData(){
    var btnPollution = document.getElementById("pollutionbtn");
    btnPollution.innerHTML = "数据读取中";
    btnPollution.disabled = true;
    var btnRain = document.getElementById("rainbtn");
    btnRain.innerHTML = "数据读取中";
    btnRain.disabled = true;
    var btnMul = document.getElementById("mulbtn");
    btnMul.innerHTML = "数据读取中";
    btnMul.disabled = true;
    readAirData();
    readPollutionData();
    readRainData();
}

function readAirData() {//��ȡ�����������
    var csv = d3.dsv(",", "text/csv;charset=gb2312");
    csv("airdata.csv", function (error, data) {
        if (error) throw error;
        var vec = [];
        for (var i in data) {
            column = 0;
            for (var j in data[i]) {
                vec.push(data[i][j]);
            }
            airData.push(vec);
            vec = [];
        }
        map = new BMap.Map("map");          // ������ͼʵ��
        var point = new BMap.Point(118.78, 32.07);
        map.centerAndZoom(point, 7);            // ��ʼ����ͼ���������ĵ�����͵�ͼ����
        map.enableScrollWheelZoom();            // �����������
        showmap(0);
        drawAirG();
    });
}
function showheat(type){//��ʾ������������ͼ
    var num = 0;
    var points = [];
    if(type == 1){
        heatmapOverlay = heat1;
    }
    heatmapOverlay.setDataSet({data: points, max: 300});
    for (var i = 0; i < airData.length; i++) {
        if (airData[i][23] == time) {
            var p = {"lng": 1, "lat": 1, "count": 1};
            p.lng = airData[i][24];
            p.lat = airData[i][25];
            p.count = airData[i][6];
            points[num] = p;
            num++;
        }
    }
    heatmapOverlay.setDataSet({data: points, max: 300});
}
function showmap(type) {//��ʾ�������ĳ�ʼ������
    if(type == 0) {
        var button1=document.getElementById("airbtn");
        button1.style.backgroundColor="#dddddd";
        var button2=document.getElementById("pollutionbtn");
        button2.style.backgroundColor="#eeeeee";
        var button3=document.getElementById("rainbtn");
        button3.style.backgroundColor="#eeeeee";
        var button4=document.getElementById("mulbtn");
        button4.style.backgroundColor="#eeeeee";
        var showdiv=document.getElementById("map");
        showdiv.style.display="block";
        var showdiv=document.getElementById("map1");
        showdiv.style.display="none";

        buttonStyle = 0;
        var point = map.getCenter();
        var level = map.getZoom();
        map = new BMap.Map("map");// ������ͼʵ��
    }
    else{
        var point = map1.getCenter();
        var level = map1.getZoom();
        map = new BMap.Map("submap1");
        map1 = map;
    }
    map.centerAndZoom(point, level);
    map.enableScrollWheelZoom();

    function ZoomControl(){
        this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
        this.defaultOffset = new BMap.Size(10, 10);
    }

    ZoomControl.prototype = new BMap.Control();
    ZoomControl.prototype.initialize = function(map){
        var div = document.createElement("div");
        div.style.cursor = "pointer";
        div.style.height="162px";
        div.style.width="60px";
        div.style.border = "0px solid gray";
        div.style.backgroundImage="url(img/air.png)";
        map.getContainer().appendChild(div);
        return div;
    }
    // 创建控件
    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);

    var num = 0;
    var points = [];
    var marker = [];
    var data_info = [];
    var vec = [];
    heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
    if(type == 1){
        heat1 = heatmapOverlay;
    }
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data: points, max: 300});
    for (var i = 0; i < airData.length; i++) {
        if (airData[i][23] == time) {
            var p = {"lng": 1, "lat": 1, "count": 1};
            p.lng = airData[i][24];
            p.lat = airData[i][25];
            p.count = airData[i][6];
            points[num] = p;
            data_info.push([p.lng, p.lat, airData[i][4]]);
            num++;
        }
    }
    marker = creatMarker(data_info, map, 0);
    if(!isSupportCanvas()){
        alert('����ͼĿǰֻ֧����canvas֧�ֵ������,����ʹ�õ����������ʹ������ͼ����~')
    }
    heatmapOverlay.setDataSet({data: points, max: 300});

    //是否支持Canvas
    function isSupportCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }

    function setGradient(){
        /*��ʽ������ʾ:
         {
         0:'rgb(102, 255, 0)',
         .5:'rgb(255, 170, 0)',
         1:'rgb(255, 0, 0)'
         }*/
        var gradient = {};
        var colors = document.querySelectorAll("input[type='color']");
        colors = [].slice.call(colors,0);
        colors.forEach(function(ele){
            gradient[ele.getAttribute("data-key")] = ele.value;
        });
        heatmapOverlay.setOptions({"gradient":gradient});
    }
    /*var mapStyle={style:"grayscale"};
     map.setMapStyle(mapStyle);*/
    //�Զ����й���ͼ����ʽ
    var myStyleJson=[
        {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
                "lightness": 10,
                "saturation": -100,
                "visibility": "off"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "subway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#dddddd",
                "visibility": "on"
            }
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#aaaaaa",
                "visibility": "on"
            }
        },
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#777777",
                "visibility": "on"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#cccccc"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#999999"
            }
        }
    ];
    map.setMapStyle({styleJson: myStyleJson });

    /*function closemarker(){
     marker.hide()
     }
     closemarker();*/
    /*closemarker=function(){marker.hide()};*/

    if(type==0) {
        function showmarker(){
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
        }
        showmarker.prototype=new BMap.Control();
        showmarker.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("显示站点"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "#dddddd";
            div.onclick = function () {
                for (var i = 0; i < marker.length; i++) {
                    marker[i].show();
                }
                removeshowmarker();
            };
            map.getContainer().appendChild(div);
            return div;
        }
        var myshowmarker = new showmarker();
        map.addControl(myshowmarker);
        function removeshowmarker() {
            map.removeControl(myshowmarker);
            map.addControl(myhidemarker);
        }
    }
    if(type==1) {
        function showmarker(){
            this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
            this.defaultOffset = new BMap.Size(10, 10);
        }
        showmarker.prototype=new BMap.Control();
        showmarker.prototype.initialize = function (map1) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("显示站点"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "#dddddd";
            div.onclick = function () {
                for (var i = 0; i < marker.length; i++) {
                    marker[i].show();
                }
                controlflag=0;
                showmap1(1);
                removeshowmarker();
            };
            map1.getContainer().appendChild(div);
            return div;
        }
        var myshowmarker = new showmarker();
        map1.addControl(myshowmarker);
        function removeshowmarker() {
            map1.removeControl(myshowmarker);
            map1.addControl(myhidemarker);
        }
    }


    if(type==0) {
        function hidemarker(){
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
        }
        hidemarker.prototype=new BMap.Control();
        hidemarker.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("隐藏站点"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "#dddddd";
            div.onclick = function () {
                for (var i = 0; i < marker.length; i++) {
                    marker[i].hide();
                }
                removehidemarker();
            };
            map.getContainer().appendChild(div);
            return div;
        }
        var myhidemarker = new hidemarker();
        map.addControl(myhidemarker);

        function removehidemarker() {
            map.removeControl(myhidemarker);
            map.addControl(myshowmarker);
        }
    }
    if(type==1) {
        function hidemarker(){
            this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
            this.defaultOffset = new BMap.Size(10, 10);
        }
        hidemarker.prototype=new BMap.Control();
        hidemarker.prototype.initialize = function (map1) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("隐藏站点"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "#dddddd";
            div.onclick = function () {
                for (var i = 0; i < marker.length; i++) {
                    marker[i].hide();
                }
                controlflag=1;
                showmap1(1);
                removehidemarker();
            };
            map1.getContainer().appendChild(div);
            return div;
        }
        var myhidemarker = new hidemarker();
        map1.addControl(myhidemarker);

        function removehidemarker() {
            map1.removeControl(myhidemarker);
            map1.addControl(myshowmarker);
        }
    }

}

function readPollutionData(){
    var csv = d3.dsv(",", "text/csv;charset=gb2312");
    csv("pollutiondata.csv", function (error, data) {
        if (error) throw error;
        var vec = [];
        for (var i in data) {
            column = 0;
            for (var j in data[i]) {
                vec.push(data[i][j]);
            }
            pollutionData.push(vec);
            vec = [];
        }
        var btnPollution = document.getElementById("pollutionbtn");
        btnPollution.innerHTML = '企业排污情况';
        btnPollution.disabled = false;
        var btnMul = document.getElementById("mulbtn");
        btnMul.innerHTML = "综合展示";
        btnMul.disabled = false;
        drawEnterprise();
    })
}
function showheat1(type){//��ʾ������������ͼ
    var num = 0;
    var points = [];
    if(type == 1){
        heatmapOverlay = heat2;
    }
    heatmapOverlay.setDataSet({data: points, max: 300});
    for (var i = 0; i < pollutionData.length; i++) {
        if (pollutionData[i][0] == time) {
            var p = {"lng": 1, "lat": 1, "count": 1};
            p.lng = pollutionData[i][21];
            p.lat = pollutionData[i][22];
            p.count = pollutionData[i][13] * 50;
            points[num] = p;
            num++;
        }
    }
    heatmapOverlay.setDataSet({data: points, max: 300});
}
function creatMarker(data_info, map, type){//����վ��
    var opts = {
        width : 100,     // ��Ϣ���ڿ��
        height: 50,     // ��Ϣ���ڸ߶�
        title : "监测站点" , // ��Ϣ���ڱ���
//            enableMessage:true//����������Ϣ�����Ͷ�Ϣ
    };
    if(buttonStyle == 1){
        opts.title = "排污公司";
    }
    var num = 0;
    var marker = [];
    for(var i=0;i<data_info.length;i++){
        var tempmarker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // ������ע
        var content = data_info[i][2];
        map.addOverlay(tempmarker);               // ����ע��ӵ���ͼ��
        marker[num] = tempmarker;
        num ++;
        addClickHandler(content,tempmarker, type);
    }
    return marker;
    function addClickHandler(content,tempmarker, type){
        tempmarker.addEventListener("mouseover",function(e){
            openInfo(content,e)
        });
        tempmarker.addEventListener("mouseout", function(e){
            map.closeInfoWindow();
        });
        tempmarker.addEventListener("click", function(e){
            if(type == 0) {
                addair = addair + 1;
                AddairData(e.target.getPosition().lng, e.target.getPosition().lat);
            }
            else if(type == 1){
                addent = addent + 1;
                AddentData(e.target.getPosition().lng, e.target.getPosition().lat);
            }
        });
    }
    function openInfo(content, e){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content, opts);
        map.openInfoWindow(infoWindow, point);
    }
}
function showmap1(type) {
    if(type == 0) {
        var button1 = document.getElementById("airbtn");
        button1.style.backgroundColor = "#eeeeee";
        var button2 = document.getElementById("pollutionbtn");
        button2.style.backgroundColor = "#dddddd";
        var button3 = document.getElementById("rainbtn");
        button3.style.backgroundColor = "#eeeeee";
        var button4 = document.getElementById("mulbtn");
        button4.style.backgroundColor = "#eeeeee";
        var showdiv = document.getElementById("map");
        showdiv.style.display = "block";
        var showdiv1 = document.getElementById("map1");
        showdiv1.style.display = "none";
        var showsubdiv1 = document.getElementById("submap1");
        showsubdiv1.style.display = "none";
        var showsubdiv2 = document.getElementById("submap2");
        showsubdiv2.style.display = "none";
        var showsubdiv3 = document.getElementById("submap3");
        showsubdiv3.style.display = "none";

        buttonStyle = 1;
        var point = map.getCenter();
        var level = map.getZoom();
        map = new BMap.Map("map");// ������ͼʵ��
    }
    else{
        var point = map2.getCenter();
        var level = map2.getZoom();
        map = new BMap.Map("submap2");
        map2 = map;
    }
    map.centerAndZoom(point, level);
    map.enableScrollWheelZoom();

    function ZoomControl(){
        this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
        this.defaultOffset = new BMap.Size(10, 10);
    }

    ZoomControl.prototype = new BMap.Control();
    ZoomControl.prototype.initialize = function(map){
        var div = document.createElement("div");
        div.style.cursor = "pointer";
        div.style.height="167px";
        div.style.width="60px";
        div.style.border = "0px solid gray";
        div.style.backgroundImage="url(img/dust.png)";
        map.getContainer().appendChild(div);
        return div;
    }
    // 创建控件
    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);

    var num = 0;
    var points = [];
    var marker = [];
    var data_info = [];
    heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
    if(type == 1){
        heat2 = heatmapOverlay;
    }
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data: points, max: 300});
    for (var i = 0; i < pollutionData.length; i++) {
        if (pollutionData[i][0] == time) {
            var p = {"lng": 1, "lat": 1, "count": 1};
            p.lng = pollutionData[i][21];
            p.lat = pollutionData[i][22];
            p.count = pollutionData[i][13] * 50;
            points[num] = p;
            data_info.push([p.lng, p.lat, pollutionData[i][2]]);
            num++;
        }
    }

    marker = creatMarker(data_info, map, 1);//����վ��

    if(!isSupportCanvas()){
        alert('����ͼĿǰֻ֧����canvas֧�ֵ������,����ʹ�õ����������ʹ������ͼ����~')
    }
    heatmapOverlay.setDataSet({data:points,max:300});



    //�ж�������Ƿ�֧��canvas
    function isSupportCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }

    function setGradient(){

        var gradient = {};
        var colors = document.querySelectorAll("input[type='color']");
        colors = [].slice.call(colors,0);
        colors.forEach(function(ele){
            gradient[ele.getAttribute("data-key")] = ele.value;
        });
        heatmapOverlay.setOptions({"gradient":gradient});
    }

    //�Զ����й���ͼ����ʽ
    var myStyleJson=[
        {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
                "lightness": 10,
                "saturation": -100,
                "visibility": "off"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "subway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#dddddd",
                "visibility": "on"
            }
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#aaaaaa",
                "visibility": "on"
            }
        },
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#777777",
                "visibility": "on"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#cccccc"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#999999"
            }
        }
    ];
    map.setMapStyle({styleJson: myStyleJson });
    if(type==0) {
        function showmarker() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
        }

        showmarker.prototype = new BMap.Control();
        showmarker.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("显示站点"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "#dddddd";
            div.onclick = function () {
                for (var i = 0; i < marker.length; i++) {
                    marker[i].show();
                }
                removeshowmarker();
            };
            map.getContainer().appendChild(div);
            return div;
        }
        var myshowmarker = new showmarker();
        map.addControl(myshowmarker);

        function removeshowmarker() {
            map.removeControl(myshowmarker);
            map.addControl(myhidemarker);
        }

        function hidemarker() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
        }

        hidemarker.prototype = new BMap.Control();
        hidemarker.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("隐藏站点"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "#dddddd";
            div.onclick = function () {
                for (var i = 0; i < marker.length; i++) {
                    marker[i].hide();
                }
                removehidemarker();
            };
            map.getContainer().appendChild(div);
            return div;
        }
        var myhidemarker = new hidemarker();
        map.addControl(myhidemarker);

        function removehidemarker() {
            map.removeControl(myhidemarker);
            map.addControl(myshowmarker);
        }
    }
    if(controlflag==0) {
        for (var i = 0; i < marker.length; i++) {
            marker[i].show();
        }
        /*function showmarker() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
        }
        showmarker.prototype = new BMap.Control();
        showmarker.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("显示站点"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "#dddddd";
            div.onclick = function () {
                for (var i = 0; i < marker.length; i++) {
                    marker[i].show();
                }
                removeshowmarker();
            };
            map.getContainer().appendChild(div);
            return div;
        }
        var myshowmarker = new showmarker();
        map.addControl(myshowmarker);

        function removeshowmarker() {
            map.removeControl(myshowmarker);
            map.addControl(myhidemarker);
        }

        function hidemarker() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
        }

        hidemarker.prototype = new BMap.Control();
        hidemarker.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("隐藏站点"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "#dddddd";
            div.onclick = function () {
                for (var i = 0; i < marker.length; i++) {
                    marker[i].hide();
                }
                removehidemarker();
            };
            map.getContainer().appendChild(div);
            return div;
        }
        var myhidemarker = new hidemarker();
        map.addControl(myhidemarker);

        function removehidemarker() {
            map.removeControl(myhidemarker);
            map.addControl(myshowmarker);
        }*/
    }
    if(controlflag==1){
        for (var i = 0; i < marker.length; i++) {
            marker[i].hide();
        }
    }

}

function readRainData(){
    var csv = d3.dsv(",", "text/csv;charset=gb2312");
    csv("raindata.csv", function (error, data) {
        if (error) throw error;
        var vec = [];
        for (var i in data) {
            column = 0;
            for (var j in data[i]) {
                vec.push(data[i][j]);
            }
            rainData.push(vec);
            vec = [];
        }
        var btnRain = document.getElementById("rainbtn");
        btnRain.innerHTML = '天气状况';
        btnRain.disabled = false;
        drawRain();
    });
}
function showWind(type){
    if(type == 1){
        map = map3;
    }
    var color = d3.interpolate(d3.rgb(140,208,99), d3.rgb(225,0,0));
    var linear = d3.scale.linear()
        .domain([0, 14])
        .range([0, 1]);
//        var allOverlay = map.getOverlays();
//        for(var i = 0; i < allOverlay.length; i ++){
//            map.removeOverlay(allOverlay[i]);
//        }

    for(var i = 0; i < rainData.length; i ++){
        if(rainData[i][3] == timeRain){
            if(rainData[i][8] > 100){
                continue;
            }
            var windcolor = color(linear(rainData[i][8]));
            var vectorFCArrow = new BMap.Marker(new BMap.Point(rainData[i][9],rainData[i][10]), {
                // ��ʼ���������ϵıպϼ�ͷ
                icon: new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW, {
                    scale: 2,
                    strokeWeight: 1,
                    rotation: rainData[i][7],//˳ʱ����ת30��
                    fillColor: windcolor,
                    fillOpacity: 0.8
                })
            });
            map.addOverlay(vectorFCArrow);
            vectorFCArrow.addEventListener("click", function(e) {
                addwea = addwea + 1;
                AddweaData(e.target.getPosition().lng, e.target.getPosition().lat);
            });
        }
    }
}
function showRain(type){
    if(type == 1){
        map = map3;
    }
    map.clearOverlays();
    var color = d3.interpolate('#CCFFFF', '#003399');
    var linear = d3.scale.linear()
        .domain([0, 4])
        .range([0, 1]);
    for(var j = 0; j < rainData.length; j ++){
        if(rainData[j][3] == timeRain){
            if(rainData[j][6] > 100){
                continue;
            }
            if(rainData[j][2] == "����"){
                rainData[j][2] = "������";
            }
            else if(rainData[j][2] == "����"){
                rainData[j][2] = "������";
            }
            var name = rainData[j][1]+rainData[j][2];
            var raincolor = color(linear(rainData[j][6]));
            var num = 0;
//                console.log(rainData[j][1], rainData[j][2]);
            creatRain(name, raincolor);
        }
    }
    showWind(type);
}
function creatRain(name, raincolor){
    var bdary = new BMap.Boundary();
    bdary.get(name, function(rs){       //��ȡ��������
                                        //map.clearOverlays();        //�����ͼ������

        var count = rs.boundaries.length; //��������ĵ��ж��ٸ�
        if (count === 0) {
//                alert(name);
            return;
        }
//            console.log(name, raincolor);
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight: 0.5,
//                    strokeColor: "steelblue",
                fillColor: raincolor
            }); //��������θ�����
            map.addOverlay(ply);  //��Ӹ�����
            pointArray = pointArray.concat(ply.getPath());
        }
//                    map.setViewport(pointArray);    //������Ұ
    });
}
function showmap2(type) {
    if(type == 0) {
        var button1 = document.getElementById("airbtn");
        button1.style.backgroundColor = "#eeeeee";
        var button2 = document.getElementById("pollutionbtn");
        button2.style.backgroundColor = "#eeeeee";
        var button3 = document.getElementById("rainbtn");
        button3.style.backgroundColor = "#dddddd";
        var button4 = document.getElementById("mulbtn");
        button4.style.backgroundColor = "#eeeeee";

        var showdiv = document.getElementById("map");
        showdiv.style.display = "block";
        var showdiv1 = document.getElementById("map1");
        showdiv1.style.display = "none";
        var showsubdiv1 = document.getElementById("submap1");
        showsubdiv1.style.display = "none";
        var showsubdiv2 = document.getElementById("submap2");
        showsubdiv2.style.display = "none";
        var showsubdiv3 = document.getElementById("submap3");
        showsubdiv3.style.display = "none";

        buttonStyle = 2;
        var point = map.getCenter();
        var level = map.getZoom();
        map = new BMap.Map("map");// ������ͼʵ��

    }
    else {
        var point = map3.getCenter();
        var level = map3.getZoom();
        map = new BMap.Map("submap3");// ������ͼʵ��
        map3 = map;
    }
    map.centerAndZoom(point, level);
    map.enableScrollWheelZoom();      // �����������
    //showWind();
    showRain();
    var myStyleJson=[
        {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
                "lightness": 10,
                "saturation": -100,
                "visibility": "off"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "subway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#dddddd",
                "visibility": "on"
            }
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#aaaaaa",
                "visibility": "on"
            }
        },
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#777777",
                "visibility": "on"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#cccccc"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#999999"
            }
        }
    ];
    map.setMapStyle({styleJson: myStyleJson });
}


function showmap3() {

    var button1=document.getElementById("airbtn");
    button1.style.backgroundColor="#eeeeee";
    var button2=document.getElementById("pollutionbtn");
    button2.style.backgroundColor="#eeeeee";
    var button3=document.getElementById("rainbtn");
    button3.style.backgroundColor="#eeeeee";
    var button4=document.getElementById("mulbtn");
    button4.style.backgroundColor="#dddddd";

    var showdiv=document.getElementById("map");
    showdiv.style.display="none";
    var showdiv1=document.getElementById("map1");
    showdiv1.style.display="block";
    var showsubdiv1=document.getElementById("submap1");
    showsubdiv1.style.display="block";
    var showsubdiv2=document.getElementById("submap2");
    showsubdiv2.style.display="block";
    var showsubdiv3=document.getElementById("submap3");
    showsubdiv3.style.display="block";

    buttonStyle = 3;
    var point = map.getCenter();
    var level = map.getZoom();
    map1 = new BMap.Map("submap1");          // 创建地图实例
    map1.centerAndZoom(point, level);            // 初始化地图，设置中心点坐标和地图级别
    map1.enableScrollWheelZoom();            //
    map2 = new BMap.Map("submap2");          // 创建地图实例
    map2.centerAndZoom(point, level);            // 初始化地图，设置中心点坐标和地图级别
    map2.enableScrollWheelZoom();            // 允许滚轮缩放
    map3 = new BMap.Map("submap3");          // 创建地图实例
    map3.centerAndZoom(point, level);            // 初始化地图，设置中心点坐标和地图级别
    map3.enableScrollWheelZoom();            // 允许滚轮缩放
    showmap(1);
    showmap1(1);
    showmap2(1);
    map2.addEventListener("zoomend",function(){
        map1.zoomTo(map2.getZoom());
        map1.panTo(map2.getCenter());
        map3.zoomTo(map2.getZoom());
        map3.panTo(map2.getCenter());
    });
    map2.addEventListener("moveend",function(){
        map1.zoomTo(map2.getZoom());
        map1.panTo(map2.getCenter());
        map3.zoomTo(map2.getZoom());
        map3.panTo(map2.getCenter());
    });
    var myStyleJson=[
        {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
                "lightness": 10,
                "saturation": -100,
                "visibility": "off"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "subway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#dddddd",
                "visibility": "on"
            }
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#aaaaaa",
                "visibility": "on"
            }
        },
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#777777",
                "visibility": "on"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#cccccc"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#999999"
            }
        }
    ];
    map1.setMapStyle({styleJson: myStyleJson });
    map2.setMapStyle({styleJson: myStyleJson });
    map3.setMapStyle({styleJson: myStyleJson });
}
