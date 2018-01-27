$(function() {
  $.getJSON("data/employees.json", function(data) {
    var statusHTML = '<ul class="bulleted">';
    $.each(data, function(index, employee) {
      if (employee.inoffice === true) {
        statusHTML += '<li class="in">';
      } else {
        statusHTML += '<li class="out">';
      }
      statusHTML += employee.name + "</li>";
    }); // end first each loop
    statusHTML += "</ul>";
    $("#employeeList").html(statusHTML);
  }); // end first getJSON

  $.getJSON("data/rooms.json", function(data) {
    var statusHTML = '<ul class="rooms">';
    $.each(data, function(index, room) {
      if (room.available === true) {
        statusHTML += '<li class="empty">';
      } else {
        statusHTML += '<li class="full">';
      }
      statusHTML += room.room + "</li>";
    }); // end second each loop
    statusHTML += "</ul>";
    $("#roomList").html(statusHTML);
  }); // end second getJSON
}); // end ready function
