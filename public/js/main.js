$(document).ready(function() {
  //
  // CLASS DEFINITIONS
  //
  var Player = function(name) {
    this.name = name;
    this.position = 0;
    this.moveCar = moveCar;

    function moveCar() {
      if (game.started == 0 ) {
        game.start();
        render();
      }
      this.position++;
      if (this.position == game.length) {
        game.finish(this);
      }
    }
  };

  var Game = function(player1, player2) {
    // this.start_time = new Date();
    this.start_time = 0;
    this.started = 0;
    this.duration = 0;
    this.length = 9;
    this.finish = finish;
    this.start = start;

    function start() {
      this.started = 1;
      this.start_time = new Date();
      // console.log(this.started + "xxx" + this.start_time);
      timeout = setInterval(render,10);
    }

    function finish(player) {
      clearInterval(timeout);
      var end = new Date();
      duration = (end - this.start_time)/1000;
      done(player,duration);
    }
  };

  var player1 = new Player("1");
  var player2 = new Player("2");
  var game = new Game(player1, player2);

  //
  // EVENT HANDLERS
  //
  $(document).on('keyup', function(event) {

    var key = event.which;
    if (key == 81) { // Q was pressed
      player1.moveCar();
    }
    else if (key == 80) { // P was pressed
      player2.moveCar();
    }
  });

  var milliseconds = 0;
  var temp;

  // function start_countup() {
  //   if (in_progress == 0 && finished == 0) {
  //     countup();
  //     in_progress = 1;
  //   };
  // }

  // function countup() {
  //   milliseconds += 10;
  //   temp = document.getElementById('time');
  //   temp.innerHTML = milliseconds/1000;
  //   if (finished == 0) {
  //     timeout = setTimeout(countup, 10);
  //   };
  // }

  function done(player,duration) {
    $.ajax({
      type: "POST",
      url: "/results",
      data: {winner: player.name, time: duration},
      success: function(data) {
        $("body").html(data);
      }
    });
  }

  function render() { //refreshes screen every 10 m.s.
      var now = new Date();
      document.getElementById('time').innerHTML = (now - game.start_time)/1000;
      $("#player1_strip td").eq(player1.position).addClass("active");
      $("#player2_strip td").eq(player2.position).addClass("active");
      $("td.active").prev().removeClass("active");
  }

});
