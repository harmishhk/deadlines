$(document).ready(function(){
    $(".entry-block").click(function(){
        $("#list").fadeOut();
        $("#details").fadeIn();
        $('#fullpage-bg').css("background-image", "url(img/portland.jpg)");
        $('#fullpage-bg').css("background-size", "cover");
        $("#entry-no").text($(this).attr('id'));
    });

    $("#details").click(function(){
        $("#details").fadeOut();
        $("#list").fadeIn();
    });
});

(function($) {
    var launch = new Date(2015, 06, 14, 11, 00);

    var shorttitle = $('#shorttitle');
    var fulltitle = $('#fulltitle');
    var days = $('#days');
    var hours = $('#hours');
    var minutes = $('#minutes');
    var seconds = $('#seconds');

    setDate();
    function setDate(){
        var now = new Date();
        if( launch < now ){
            days.html('<h3>0</h3><p>day</p>');
            hours.html('<h3>0</h3><p>hour</p>');
            minutes.html('<h3>0</h3><p>minute</p>');
            seconds.html('<h3>0</h3><p>second</p>');
            shorttitle.html('...');
            fulltitle.html('...');
        }
        else{
            var s = -now.getTimezoneOffset()*60 + (launch.getTime() - now.getTime())/1000;
            var d = Math.floor(s/86400);
            days.html('<h3>'+d+'</h3><p>Day'+(d>1?'s':''),'</p>');
            s -= d*86400;

            var h = Math.floor(s/3600);
            hours.html('<h3>'+h+'</h3><p>Hour'+(h>1?'s':''),'</p>');
            s -= h*3600;

            var m = Math.floor(s/60);
            minutes.html('<h3>'+m+'</h3><p>Minute'+(m>1?'s':''),'</p>');

            s = Math.floor(s-m*60);
            seconds.html('<h3>'+s+'</h3><p>Second'+(s>1?'s':''),'</p>');
            setTimeout(setDate, 1000);

            shorttitle.html('HRI');
            fulltitle.html('human robot interaction');
        }
    }
})(jQuery);
