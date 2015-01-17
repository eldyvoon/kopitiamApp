angular.module('panda.controllers', [])

.controller('loginCtrl', function($scope, $state, panda, $rootScope){
  $scope.form = {};
  $scope.login = function(){
    console.log($scope.form)

    panda.login($scope.form).then(function(response){
      if(response.username){
        console.info('okay');
        localStorage.setItem('username',$scope.form.username);
        localStorage.setItem('password',$scope.form.pass);
        $state.go('home');

        // sending username to AppCtrl
        $rootScope.$broadcast('username',response.username);
      }
      else {
        console.warn('not okay');
      }
    })
  }
})

.controller('reply', function($scope,$ionicPopup,$stateParams,panda){

  $scope.reply = {};

  $scope.showPopup = function() {
    $scope.data = {}

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="reply.text">',
      title: 'Reply',
      subTitle: $stateParams.topicId,
      scope: $scope,
      buttons: [
    { text: 'Cancel' },
  {
    text: '<b>Reply</b>',
    type: 'button-positive',
    onTap: function(e) {
      if (!$scope.reply.text) {
        e.preventDefault();
      } else {
        return $scope.reply;
      }
    }
  }
  ]
});
myPopup.then(function(res) {
  console.log('Tapped!', res);
  $scope.getUser = localStorage.getItem('username');
  $scope.getPass = localStorage.getItem('password');

  panda.reply($stateParams.topicId,$scope.reply,$scope.getUser,$scope.getPass).then(function(){

  })
});
};

})
