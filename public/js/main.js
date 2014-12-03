$(document).ready(function() {
  var in_progress = 0;
  var finished = 0;

  $(document).on('keyup', function(event) {

    var key = event.which;
    if (key == 81 && finished == 0) { // Q was pressed
      start_countup();
      $("#player1_strip td.active").next().addClass("active");
    }
    else if (key == 80 && finished == 0) { // P was pressed
      start_countup();
      $("#player2_strip td.active").next().addClass("active");
    }

    $("td.active").prev().removeClass("active");


    if ($("#player1_strip td").last().hasClass("active")) {
      in_progress = 0;
      finished = 1;
      done(document.getElementById("player1").innerHTML);
    }
    else if ($("#player2_strip td").last().hasClass("active")) {
      in_progress = 0;
      finished = 1;
      done(document.getElementById("player2").innerHTML);
    }

  });

  // $( "#restart" ).click(function() {
  //   $("td.active").removeClass("active");
  //   $("#player1_strip td").first().addClass("active");
  //   $("#player2_strip td").first().addClass("active");
  // });

  var milliseconds = 0;
  var temp;

  function start_countup() {
    if (in_progress == 0 && finished == 0) {
      countup();
      in_progress = 1;
    };
  }

  function done(player) {
    $.ajax({
      type: "POST",
      url: "/results",
      data: {time: milliseconds/1000, winner: player},
      success: function(data) {
        $("body").html(data);
      }
    });
  }

  function countup() {
    milliseconds += 10;
    temp = document.getElementById('time');
    temp.innerHTML = milliseconds/1000;
    if (finished == 0) {
      timeout = setTimeout(countup, 10);
    };
  }

});
