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
            var result = "";
            switch(this.tagCtx.props.type) {
                case "view":
                    result = new moment(value).format("LLLL");
                    break;
                case "counter":
                    result = new moment(value).format("YYYY[/]MM[/]DD hh[:]mm[:]ss");
                    break;
            }
            return result;
        }
    });

    // applyt html template to json data using jsrender
    $("#entries").html($.templates("#entry-tmpl").render(entries));

    // initialize the counters
    $('[data-countdown]').each(function() {
        $(this).countdown($(this).data('countdown'), function(event) {
            $(this).html(event.strftime(''
            + '<div class="list-timer-section"><div class="list-timer-amount">%D</div><div class="list-timer-period">day%!d</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%H</div><div class="list-timer-period">hour%!H</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%M</div><div class="list-timer-period">minute%!M</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%S</div><div class="list-timer-period">second%!S</div></div>'
            ));
        });
    });

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
    $(".entry").click(function(event){
        // get clicket entry
        var entry = null;
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].entry_no == $(this).attr('id')) {
                entry = entries[i];
                break;
            }
        }

        // render details page with clicked entry
        $("#details").html($.templates("#details-tmpl").render(entry));

        // initialize counter on the details page
        $('#detail-timer').countdown(moment(entry.date).format("YYYY[/]MM[/]DD hh[:]mm[:]ss")).on('update.countdown', function(event) {
            $(this).html(event.strftime(''
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%D</div><div class="detail-timer-period">day%!d</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%H</div><div class="detail-timer-period">hour%!H</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%M</div><div class="detail-timer-period">minute%!M</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%S</div><div class="detail-timer-period">second%!S</div></div>'));
        });

        // update center of the map from location specified in entry
        map.setView({
            center: new Microsoft.Maps.Location(entry.location.split(",")[0],entry.location.split(",")[1]),
            animate:false
        });

        // finally show the details page
        $("#entries-view").fadeOut('slow');
        $("#details-view").delay(800).fadeIn('slow');
    });

    // transit back to list view when something is clicked on detailed view
    $("#details-view").click(function(){
        $("#details-view").fadeOut('slow');
        $("#entries-view").delay(800).fadeIn('slow');
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

    // show current time on list view page
    $('#date').html(moment().format("dddd, MMMM Do, YYYY, h:MM:ss A"));
    setInterval(function(){
        $('#date').html(moment().format("dddd, MMMM Do, YYYY, h:MM:ss A"));
    }, 1000);
    // smooth fadein effect at start
    $("#entries-view").delay(200).fadeIn('slow');
});
