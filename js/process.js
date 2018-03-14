var pos = 0;
var processLength = 1200;
//(function ($) {
var $box = $('#process_box');
var $bg = $('#process_bg');
var $bgcolor = $('#process_bgcolor');
var $btn = $('#process_bt');
var $text = $('#process_text');
var statu = false;

    var ox = 0;
    var lx = 0;
    var left = 0;
    var bgleft = 0;
    $btn.mousedown(function (e) {
        lx = $btn.offset().left;
        ox = e.pageX - left;
        statu = true;
    });
    $(document).mouseup(function () {
        statu = false;
    });
    $box.mousemove(function (e) {
        if (statu) {
            left = e.pageX - ox;
            if (left < 0) {
                left = 0;
            }
            if (left > processLength) {
                left = processLength;
            }
            $btn.css('left', left);
            $bgcolor.width(left);
            pos = parseInt(left);
            change();
        }
    });
    $bg.click(function (e) {
        if (!statu) {
            bgleft = $bg.offset().left;
            left = e.pageX - bgleft;
            if (left < 0) {
                left = 0;
            }
            if (left > processLength) {
                left = processLength;
            }
            $btn.css('left', left);
            $bgcolor.stop().animate({width: left}, processLength);
            pos = parseInt(left);
            change();
        }
    });
    //})(jQuery);
    function change() {
        var xScale = d3.scale.linear()
            .domain([0, processLength])
            .range([0, 743]);
        pos = Math.round(xScale(pos));
        //console.log(pos);
        setTime(pos);
    }


function setTime(pos2){
    var day = Math.floor(pos2 / 24) + 1;
    var time1 = pos2 % 24;
    time = '2015/12/' + day + ' ' + time1 + ':00';
    if(day < 10){
        day = '0' + day;
    }
    if(time1 < 10){
        time1 = '0' + time1;
    }
    timeRain = '201512' + day + time1;
    $text.html('time:' + time);

    if(buttonStyle == 0){
        showheat(0);
    }
    else if(buttonStyle == 1){
        showheat1(0);
    }
    else if(buttonStyle == 2){
        showRain(0);
    }
    else{
        showheat(1);
        showheat1(1);
        showRain(1);
    }
    if(addair == 0){
        drawAirG();
    }
    else{
        AddairData(0, 0);
    }
    if(addent == 0){
        drawEnterprise();
    }
    else{
        AddentData(0, 0);
    }
    if(addwea == 0){
        drawRain();
    }
    else{
        AddweaData(0, 0);
    }
}
var startid;
function startend() {
    var btnStart = document.getElementById("startbtn");
    if(btnStart.innerHTML == "开始"){
        startid = setInterval("pos += 1;  if (pos > processLength) {pos = processLength;};$btn.css('left', pos);$bgcolor.width(pos);setTime(pos)", 500);
        btnStart.innerHTML = "暂停";
    }
    else{
        clearInterval(startid);
        btnStart.innerHTML = "开始";
    }


}



