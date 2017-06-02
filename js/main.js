function setup() {

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

        // remove passed entries
        for (var i = json.length -1; i >= 0 ; i--){
            if(moment(json[i].date).isBefore()){
                json.splice(i, 1);
            }
        }

        return json.sort(function(lhs, rhs) {return moment(lhs.date) > moment(rhs.date) ? 1 : moment(lhs.date) < moment(rhs.date) ? -1 : 0;});
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
                    result = new moment(value).format("YYYY[/]MM[/]DD HH[:]mm[:]ss");
                    break;
            }
            return result;
        }
    });

    // applyt html template to json data using jsrender
    $("#entries").html($.templates("#entry-tmpl").render(entries));

    // initialize the counters
    $('[data-countdown]').each(function() {
        $(this).countdown($(this).data('countdown'))
        .on('update.countdown', function(event) {
            $(this).html(event.strftime(''
            + '<div class="list-timer-section"><div class="list-timer-amount">%D</div><div class="list-timer-period">day%!d</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%H</div><div class="list-timer-period">hour%!H</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%M</div><div class="list-timer-period">minute%!M</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%S</div><div class="list-timer-period">second%!S</div></div>'
            ));
            // update current date on lists page within same callback
            $('#date').html(moment().format("LLLL"));
        })
        .on('finish.countdown', function(event) {
            $(this).html(event.strftime(''
            + '<div class="list-timer-section"><div class="list-timer-amount">%D</div><div class="list-timer-period">day%!d</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%H</div><div class="list-timer-period">hour%!H</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%M</div><div class="list-timer-period">minute%!M</div></div>'
            + '<div class="list-timer-section"><div class="list-timer-amount">%S</div><div class="list-timer-period">second%!S</div></div>'
            ));
            var node = this;
            while(node.id.indexOf("entry") == -1) {
                node = node.parentElement;
            }
            $(node).delay(4000).fadeOut("slow");
            $(node.nextElementSibling).delay(4000).fadeOut("slow");
        });
    });

    // set background image of details page to show bing map
    var mapOptions = {
        credentials: "Your Bing Maps Key",
        showDashboard: false,
        showScalebar: false,
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        zoom: 13
    }
    var map = new Microsoft.Maps.Map('#map', mapOptions);

    // transit to detailed view when any entry is clicked
    $(".entry").click(function(event){
        // get clicked entry
        var entry = null;
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].shorttitle == $(this).attr('id')) {
                entry = entries[i];
                break;
            }
        }

        // render details page with clicked entry
        $("#details").html($.templates("#details-tmpl").render(entry));

        // initialize counter on the details page
        $('#detail-timer').countdown(moment(entry.date).format("YYYY[/]MM[/]DD HH[:]mm[:]ss"))
        .on('update.countdown', function(event) {
            $(this).html(event.strftime(''
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%D</div><div class="detail-timer-period">day%!d</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%H</div><div class="detail-timer-period">hour%!H</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%M</div><div class="detail-timer-period">minute%!M</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%S</div><div class="detail-timer-period">second%!S</div></div>'));
        }).on('finish.countdown', function(event) {
            $(this).html(event.strftime(''
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%D</div><div class="detail-timer-period">day%!d</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%H</div><div class="detail-timer-period">hour%!H</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%M</div><div class="detail-timer-period">minute%!M</div></div>'
            + '<div class="detail-timer-section"><div class="detail-timer-amount">%S</div><div class="detail-timer-period">second%!S</div></div>'));
            $("#details-view").fadeOut(4000);
            $("#entries-view").delay(4000).fadeIn('slow');
        });

        // update center of the map from location specified in entry, if given
        if('location' in entry) {
            map.setView({
                center: new Microsoft.Maps.Location(entry.location.split(",")[0],entry.location.split(",")[1])
            });
            $('#map').show();
        }
        else {
            $('#map').hide();
        }


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
            center: map.getCenter()
        });
    });

    // smooth fade-in effect at start
    $("#entries-view").delay(200).fadeIn('slow');
}
