var request = require('request');
var date = new Date();

request({
  uri: 'https://canvas.instructure.com/api/v1/courses',
  method: 'GET',
  headers: {
    authorization: 'Bearer 1876~Tq6YBMeFpIrWkggAEWJs4etCv3z9FPmijJnnSoBTnkYmef1NB4FyqLdvbLpYlKcW'
  }
}, function(error, response, body) {
  //console.log(body);
  getAssignments(body);
});

function getAssignments(jsonBody){
  //console.log(jsonBody);
  var parsedJSON = JSON.parse(jsonBody);
  //console.log(parsedJSON);
  for (var i = 0; i<parsedJSON.length; i++){
    var course = parsedJSON[i];
    // console.log(course);
    // console.log("END DATE");
    // console.log(course['end_at'])
    var parsedEndDate = Date.parse(course['end_at']);
    // console.log("PARSED END DATE")
    // console.log(parsedEndDate);
    if(parsedEndDate > date){
      var courseId = parsedJSON[i]['id'];
      var courseName = parsedJSON[i]['name'];
      getAssignment(courseId,courseName);
    }
  }
}

function getAssignment(id,name){
  request({
    uri: 'https://canvas.instructure.com//api/v1/courses/' + id + '/assignments',
    method: 'GET',
    headers: {
      authorization: 'Bearer 1876~Tq6YBMeFpIrWkggAEWJs4etCv3z9FPmijJnnSoBTnkYmef1NB4FyqLdvbLpYlKcW'
    }
  }, function(error, response, body) {
    // console.log('Assignments for course: ' + name);
    // console.log(body);
    //sendToTrello(parseForTrello(body));
  });
}

function parseForTrello(jsonBody){
  var cardProps={
    name: jsonBody['name'],
    desc: jsonBody['description'],
    idList: "",
    due: Date.parse(jsonBody['due_at']),
    pos: "top",
    urlSource: null
  };
  return cardProps;
}

function sendToTrello(options){
  options.uri = "https://api.trello.com/1/cards/";
  options.method = "POST";
  request(options, function(e){
    console.log(e);
  });
}