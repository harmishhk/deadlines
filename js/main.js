$(document).ready(function(){

    // load the data from deadlines.json file
    $.getJSON('deadlines.json', function(entries) {
        // applyt html template to json data
        var template = $.templates("#entry-tmpl");
        var htmlOutput = template.render(entries);
        $("#entry-list").html(htmlOutput);

        // initialize counters
        $('[data-countdown]').each(function() {
            var $this = $(this), finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function(event) {
                $this.html(event.strftime(''
                + '<div class="list-timer-section"><div class="list-timer-amount">%D</div><div class="list-timer-period">day%!d</div></div>'
                + '<div class="list-timer-section"><div class="list-timer-amount">%H</div><div class="list-timer-period">hr</div></div>'
                + '<div class="list-timer-section"><div class="list-timer-amount">%M</div><div class="list-timer-period">min</div></div>'
                + '<div class="list-timer-section"><div class="list-timer-amount">%S</div><div class="list-timer-period">sec</div></div>'
                ));
            });
        });

        // apply colors to different entries
        var colors = ["#E773BD","#CEA539","#94BD4A","#439D9A", "#6BA5E7", "#7F6E94", "#AA4379", "#AA4344", "#C27D4F", "#3A9548", "#306772", "#2C4566", "#423173", "#4C2C66", "#662C58", "#61292B", "#543A24"];
        var rand = Math.floor(Math.random()*colors.length);
        $('#entry1').css("background-color", colors[rand]);
        rand = Math.floor(Math.random()*colors.length);
        $('#entry2').css("background-color", colors[rand]);

        // trasit to detailed view when any entry is clicked
        $(".entry-block").click(function(){
            $("#list-view").fadeOut();
            $("#details-view").fadeIn();
            $('#fullpage-bg').css("background-image", "url(img/portland.jpg)");
            $('#fullpage-bg').css("background-size", "cover");
        });

        // transit back to list view when something is clicked on detailed view
        $("#details-view").click(function(){
            $("#details-view").fadeOut();
            $("#list-view").fadeIn();
        });
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
