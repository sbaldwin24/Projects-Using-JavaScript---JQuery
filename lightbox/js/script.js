var $overlay = $('<div class="overlay"></div>');
var $image = $("<img>");
var $caption = $("<p></p>");

$overlay.append($image);

$overlay.append($caption);

$("body").append($overlay);

$("#imageGallery").on("click", "a", function(e) {
    e.preventDefault();
    var imageLocation = $(this).prop("href");

    $image.prop("src", imageLocation);
    $overlay.show();

    var captionText = $(this).children("img").prop("alt");

    $caption.text(captionText);
}); // END on click event


$overlay.on("click", function() {
    $overlay.hide();
}); // END second on click event
