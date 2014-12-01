$(document).ready(function(){
    $(".entry-block").click(function(){
        $("#list").fadeOut();
        $("#details").fadeIn();
        $("#entry-no").text($(this).attr('id'));
    });

    $("#details").click(function(){
        $("#details").fadeOut();
        $("#list").fadeIn();
    });
});
