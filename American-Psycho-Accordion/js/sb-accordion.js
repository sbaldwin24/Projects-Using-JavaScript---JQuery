$(document).ready(function() {
  //Here comes some magical jQuery ;)

  $("#container h1").css("opacity", "0");
  $("#primary_content").css("opacity", "0");
  $("#accordion").css("width", "0");
  var secondaryHeight = $("#secondary_content").height();
  $("#secondary_content").css("height", "0");
  $("#secondary_content").css("opacity", "0");
  $("#container h1").animate(
    {
      opacity: "0.01"
    },
    500,
    function() {
      $("#accordion").animate(
        {
          width: "100%"
        },
        700,
        function() {
          $("#primary_content").animate(
            {
              opacity: "1"
            },
            300,
            function() {
              $("#secondary_content").animate(
                {
                  height: secondaryHeight,
                  opacity: "1"
                },
                300,
                function() {
                  $("#container h1")
                    .stop()
                    .animate({
                      opacity: "1"
                    });
                }
              );
            }
          );
        }
      );
    }
  );

  // AUDIO --> I HAVE TO RETURN SOME VIDEOTAPES //
  function addSource(elem, path) {
    $("<source>")
      .attr("src", path)
      .appendTo(elem);
  }

  $("#videoTapes").mouseenter(function() {
    var audio = $("<audio />", {
      autoPlay: "autoplay"
    });
    addSource(
      audio,
      "audio/videotapes-" + Math.ceil(Math.random() * 3) + ".mp3"
    );
    addSource(
      audio,
      "audio/videotapes-" + Math.ceil(Math.random() * 3) + ".ogg"
    );
    audio.appendTo("body");
  });

  $("#accordion li").on("click", function() {
    window.open(
      $(this)
        .find("a")
        .attr("href")
    );
  });

  /**
   * @todo
   * Need to change this to a mouseenter and mouseleave event
   * hover is deprecated
   */
  $("#accordion > li").hover(
    function() {
      console.log("moto");
      $("#content, h1")
        .stop()
        .animate({ opacity: ".2" });
      $(".morph")
        .stop()
        .animate({ color: "#9EAEBE" }, 400);
      $(".morph_alt")
        .stop()
        .animate({ color: "#9EAEBE" }, 400);

      $(this)
        .stop()
        .animate(
          {
            width: "318px"
          },
          300,
          function() {}
        );
      $(this)
        .find("h3")
        .stop()
        .animate(
          {
            backgroundPosition: "-72px"
          },
          300,
          function() {}
        );
    },
    function() {
      $(".morph")
        .stop()
        .animate({ color: "#00aaf0" }, 400);
      $(".morph_alt")
        .stop()
        .animate({ color: "#00aaf0" }, 400);
      $("#content, h1")
        .stop()
        .animate({ opacity: "1" });
      $(this)
        .stop()
        .animate(
          {
            width: "72px"
          },
          300,
          function() {}
        );
      $(this)
        .find("h3")
        .stop()
        .animate(
          {
            backgroundPosition: "0px"
          },
          300,
          function() {}
        );
    }
  );
});
