$(document).ready(function(){

    // load json data using a blocking call
    var entries = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'deadlines.json',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

    // function to convert date values for view and counters
    $.views.converters({
        format: function(value) {
            var type = this.tagCtx.props.type;

            var myDate = new moment(value);
            var result = "";

            switch(type) {
                case "view":
                    result = myDate.format("LLLL");
                    break;

                case "counter":
                    result = myDate.format("YYYY[/]MM[/]DD hh[:]mm[:]ss");
                    break;
            }

            return result;
        }
    });

    // applyt html template to json data using jsrender
    var template = $.templates("#entry-tmpl");
    var htmlOutput = template.render(entries);
    $("#entry-list").html(htmlOutput);

    // initialize the counters
    $('[data-countdown]').each(function() {
        var $this = $(this), finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function(event) {
            $this.html(event.strftime(''
            + '<div class="list-timer-section"><div class="list-timer-amount">%D</div><div class="list-timer-period">day%!d</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%H</div><div class="list-timer-period">hour%!H</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%M</div><div class="list-timer-period">minute%!M</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%S</div><div class="list-timer-period">second%!S</div></div>'
            ));
        });
    });

    // apply colors to different entries
    var colors = ["#E773BD","#CEA539","#94BD4A","#439D9A", "#6BA5E7", "#7F6E94", "#AA4379", "#AA4344", "#C27D4F", "#3A9548", "#306772", "#2C4566", "#423173", "#4C2C66", "#662C58", "#61292B", "#543A24"];
    var rand = Math.floor(Math.random()*colors.length);
    $('#entry-1').css("background-color", colors[rand]);
    rand = Math.floor(Math.random()*colors.length);
    $('#entry-2').css("background-color", colors[rand]);

    // set background image of details page to show bing map
    var mapOptions = {
        credentials: "Your-Bing-Maps-Key",
        showDashboard: false,
        showScalebar: false,
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        width: $(window).width(),
        height: $(window).height(),
        zoom: 13
    }
    var map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);

    // trasit to detailed view when any entry is clicked
    $(".entry-block").click(function(event){
        // get clicket entry
        var entry = null;
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].entry_no == $(this).attr('id')) {
                entry = entries[i];
                break;
            }
        }

        // render details page with clicked entry
        var template = $.templates("#details-tmpl");
        var htmlOutput = template.render(entry);
        $("#details-page").html(htmlOutput);

        // initialize counter on the details page
        $('#data-detail-counter').countdown(moment(entry.date).format("YYYY[/]MM[/]DD hh[:]mm[:]ss")).on('update.countdown', function(event) {
            var $this = $(this).html(event.strftime(''
            + '<div class="list-timer-section"><div class="list-timer-amount">%D</div><div class="list-timer-period">day%!d</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%H</div><div class="list-timer-period">hour%!H</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%M</div><div class="list-timer-period">minute%!M</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%S</div><div class="list-timer-period">second%!S</div></div>'));
        });

        // update center of the map from location specified in entry
        map.setView({
            center: new Microsoft.Maps.Location(entry.location.split(",")[0],entry.location.split(",")[1]),
            animate:false
        });

        // finally show the details page
        $("#list-view").fadeOut('slow');
        $("#details-view").delay(800).fadeIn('slow');
    });

    // transit back to list view when something is clicked on detailed view
    $("#details-view").click(function(){
        $("#details-view").fadeOut('slow');
        $("#list-view").delay(800).fadeIn('slow');
    });

    // resize and re-center the map on window resize
    $(window).resize(function () {
        map.setView({
            width: $(window).width(),
            height: $(window).height(),
            center: map.getCenter(),
            animate:false
        });
    });
});
