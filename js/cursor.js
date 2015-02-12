window.cursor = $('#cursor');
window.output = $('#output');

// Leap.loop({hand: function(hand){
window.leapCursor = function(hand) {
  var screenPosition = hand.screenPosition(hand.palmPosition);
  console.log(screenPosition);
  var outputContent = "x: " + (screenPosition[0].toPrecision(4)) + 'px' +
     "        <br/>y: " + (screenPosition[1].toPrecision(4)) + 'px' +
     "        <br/>z: " + (screenPosition[2].toPrecision(4)) + 'px';


  // hide and show the cursor in order to get second-topmost element.
  cursor.hide();
  var el = document.elementFromPoint(
    hand.screenPosition()[0],
    hand.screenPosition()[1]
  );
  cursor.show();

  if (el) {
    outputContent += '<br>Topmost element: '+ el.tagName + ' #' + el.id +  ' .' + el.className;
  }

  output.html(outputContent);

  var s = -0.2;

  var x = screenPosition[0] * s + $(window).width() / 2;
  var y = screenPosition[1] * s + $(window).height() + 250;
  cursor.css({
    left: x + 'px',
    top:  y + 'px'
  });

  var cursor_pos = document.getElementById("cursor").getBoundingClientRect();
  x = cursor_pos.x + cursor_pos.width / 2;
  y = cursor_pos.y + cursor_pos.height / 2;

  for (var button_number = 1; button_number <= window.button_count; ++button_number) {
    var position = document.getElementById("button" + button_number).getBoundingClientRect()
    if (x >= position.x && x <= position.x + position.width &&
        y >= position.y && y <= position.y + position.height) {
      if (window.button_state[button_number + "hover"] == false) {
        window.button_state[button_number + "hover"] = true;
        // Toggle
        if (window.button_state[button_number + "active"]) {
          // Hide Box
          $("#box" + button_number).css("display", "none");
          $("#button" + button_number).removeClass("active");
          window.button_state[button_number + "active"] = false;
          window.zoom = true;
        } else {
          // Show Box
          $("#box" + button_number).css("display", "block");
          $("#button" + button_number).removeClass("active").addClass("active");
          window.button_state[button_number + "active"] = true;
          window.zoom = false;
          // Hide all other boxes
          for (var i = 1; i <= window.button_count; ++i) {
            // Only if this is not the current box!
            if (i != button_number) {
              // Hide Box
              $("#box" + i).css("display", "none");
              $("#button" + i).removeClass("active");
              window.button_state[i + "active"] = false;
            }
          }
        }
      }
    } else {
      window.button_state[button_number + "hover"] = false;
    }
  }
};
