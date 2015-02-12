$(function() {
  // Status initialisieren
  window.button_count = 5;
  window.zoom = true;
  window.button_state = {};
  for (var button_number = 1; button_number <= window.button_count; ++button_number) {
    window.button_state[button_number + "hover"] = false;
    window.button_state[button_number + "active"] = false;
  }

  Leap.loop({
    hand: function(hand) {
      if (window.zoom) leapZoom(hand);
      leapCursor(hand);
    }
  }).use('screenPosition', {scale: -3});
});
