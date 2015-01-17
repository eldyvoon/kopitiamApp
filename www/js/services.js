angular.module('panda.services', [])

.service('panda', function($http){
  return({
    login:login,
    reply:reply
  })

  function login(form){
    var request = $http({
      method: "POST",
      url: "http://azizi2u.com/lowyat/lowyat.php",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: {
          username:form.username,
          password: form.pass
        }
    })
    return (request.then(handleSuccess, handleError));
  }

  function reply(topicId,content,username,pass){
    console.log(topicId);
    console.log(content.text);
    var request = $http({
      method: "POST",
      // url: "http://azizi2u.com/lowyat/reply.php",
      url: "http://localhost/typeracer/action.php",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: {
          user:username,
          pass:pass,
          content:content.text,
          url:"https://forum.lowyat.net/topic/"+topicId
        }
    })
    return (request.then(handleSuccess, handleError));
  }

  function handleSuccess( response ) {
    return( response.data );
  }
  function handleError( response ) {
    return 0;
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
