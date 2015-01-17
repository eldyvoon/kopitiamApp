	var app = angular.module('App',['ionic', 'panda.controllers', 'panda.services']);

	app.config(function ($httpProvider,$stateProvider, $urlRouterProvider) {
		$httpProvider.defaults.transformRequest = function(data){
			if (data === undefined) {
				return data;
			}
			return $.param(data);

		}

		$urlRouterProvider.otherwise('login');
		$stateProvider.state('login', {
		  url: '/login',
		  templateUrl: 'templates/login.html',
			controller: 'loginCtrl'
		})

		$stateProvider.state('home', {
		  url: '/home',
		  templateUrl: 'templates/home.html'
		})

		$stateProvider.state('tContent', {
		  url: '/tContent/:topicId',
		  templateUrl: 'templates/tContent.html',
		  controller : 'tContentCtrl'

	});

	});

	app.controller('AppCtrl', ['$sce','$scope', '$http', 'getTopicContent', '$rootScope', function($sce, $scope, $http, getTopicContent, $rootScope){

/*			function checkConnection() {
			    var networkState = navigator.connection.type;

			    var states = {};
			    states[Connection.UNKNOWN]  = 'Unknown connection';
			    states[Connection.ETHERNET] = 'Ethernet connection';
			    states[Connection.WIFI]     = 'WiFi connection';
			    states[Connection.CELL_2G]  = 'Cell 2G connection';
			    states[Connection.CELL_3G]  = 'Cell 3G connection';
			    states[Connection.CELL_4G]  = 'Cell 4G connection';
			    states[Connection.CELL]     = 'Cell generic connection';
			    states[Connection.NONE]     = 'No network connection';

			    alert('Connection type: ' + states[networkState]);
			}

			checkConnection();*/

			// received username from loginCtrl - panda.controllers
			$rootScope.$on('username', function(event,data){
				$rootScope.username = data;
				console.log(data);
			})


		  $scope.splash = true;

		  $scope.trustAsHtml = $sce.trustAsHtml;

		  $scope.doRefresh = function() {
		  	getList();
		  }

		var getList = function(){
				$http({
		        // url: "http://daysof.me/lowyat/list.php",
		        url: "http://azizi2u.com/lowyat/list.php",
		        method: "GET"
		    }).finally(function () {
		        $scope.$broadcast('scroll.refreshComplete');
		        $scope.splash = false;

		    }).then(function (response) {
		        $scope.data = response.data;
		    });
		}

		$scope.init = function () {
		    getList();

		};




	}]);

	app.controller('tContentCtrl', ['$scope', '$http','$state','$stateParams','$timeout','getTopicContent', function($scope,$http,$state,$stateParams,$timeout,getTopicContent){

		$scope.ionLoader = true;
		$scope.threadContent = [];
		$scope.splash = false;

		 getTopicContent.request($stateParams.topicId).then(function(response){
        	$scope.threadContent = response.data;
					$scope.topicTitle = response.data[0].title;

        	totalPages = response.data[0].totalPages;

			$timeout(function () {

				   $('a').click(function () {
				     var url = $(this).attr('href');
				     window.open(encodeURI(url), '_system', 'location=yes');
				     return false;
				   })

						$('.spoilertop').removeAttr('onclick').unbind('click');
						$('.spoilertop').click(function(){
							$(this).next('.spoilermain').toggle();
						});
					});


	    }).finally(function(){
			$scope.ionLoader = false;

	    });


	    currentPage = 1;

	    Array.prototype.pushArray = function() {
			    this.push.apply(this, this.concat.apply([], arguments));
			};

	    $scope.loadPages = function() {



				if(!$scope.infiniteScoll && currentPage < totalPages){

						$scope.infiniteScoll = true;

			            $http({
			                // url: "http://daysof.me/lowyat/thread.php",
			                url: "http://azizi2u.com/lowyat/thread.php",
			                method: "GET",
			                params: {"topicId": $stateParams.topicId, "pageNumber": currentPage}
			            }).then(function(response){

			                    $scope.threadContent.pushArray(response.data);

			                    currentPage = parseInt(response.data[0].currentPage) + 1;
			                    totalPages = parseInt(response.data[0].totalPages) + 1;

			                    		          $timeout(function () {

														   $('a').click(function () {
														     var url = $(this).attr('href');
														     window.open(encodeURI(url), '_system', 'location=yes');
														     return false;
														   })

																$('.spoilertop').removeAttr('onclick').unbind('click');
																$('.spoilertop').click(function(){
																	$(this).next('.spoilermain').toggle();
																});
															});

			            }).finally(function(){

			            	$scope.infiniteScoll = false;

			            });

			    }
	    }


	    $scope.home = function(){
	    	$state.go('home');
	    }

	      $scope.reportEvent = function(event)  {
		    $scope.home();

		  }


	}]);

	app.factory('getTopicContent', ['$http', function($http){

		var query = function($topicId) {
			return $http({
		        // url: "http://daysof.me/lowyat/thread.php",
		        url: "http://azizi2u.com/lowyat/thread.php",
		        method: "GET",
		        params: {topicId: $topicId}
		    })
	    }

		return {
			request : function($topicId){
				return query($topicId);
			}

		}
	}]);


	app.directive('whenScrolled', function() {
	    return function(scope, elm, attr) {
	        var raw = elm[0];

	        elm.bind('scroll', function() {
	            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
	                scope.$apply(attr.whenScrolled);
	            }
	        });
	    };
	});

	app.directive('detectGestures', function($ionicGesture) {
		  return {
		    restrict :  'A',

		    link : function(scope, elem, attrs) {
		      var gestureType = attrs.gestureType;

		      switch(gestureType) {
		        case 'swipeleft':
		          $ionicGesture.on('swipeleft', scope.reportEvent, elem);
		          break;
		      }

		    }
		  }
		})
