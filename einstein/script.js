$(function() {
    $(this).on("keydown", function(key) {
        switch(parseInt(key.which, 10)) {
            // Using Radix 10
            case 37:
            // 37 -> Left arrow key pressed
                $("img").animate({left: "-=10px"}, "fast");
                break;
            case 38:
            // 38 -> Up arrow pressed
                $("img").animate({top: "-10px"}, "fast");
                break;
            case 39:
            // 39 -> Right arrow pressed
                $("img").animate({left: "+=10px"}, "fast");
                break;
            case 40:
            // 40 -> Down arrow pressed
                $("img").animate({top: "+=10px"}, "fast");
        }
    })
});
