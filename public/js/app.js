var App = angular.module('moviesApp',["ui.router"]);

App.run(["$rootScope",
    function ($rootScope) {

        // Scope Globals
        $rootScope.$restpath = 'https://movie-ranking.herokuapp.com/';
        $rootScope.app = {
            name: 'Movies',
            description: 'Ranking of movies',
            year: ((new Date()).getFullYear())
        };
    }]).run(function ($state, $location) {

        $location.url('/movies');
});

App.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        'use strict';
	
	//$urlRouterProvider.when('#', $window.history.back());

        $stateProvider
            .state('movies', {
                url: '/movies',
                templateUrl: 'public/movies.html'
            }).state('ratings', {
                url: '/ratings/:id/:title',
                templateUrl: 'public/ratings.html'
            });
    }]);

App.controller('moviesController',['$state','$scope', '$rootScope', '$http', function($state, $scope, $rootScope, $http){
	$scope.movies = [];
	$http.get($rootScope.$restpath  + 'movies')
		.success(function (response) {
			$scope.movies = response;
		})
		.error(function (data, status, headers, config) {
			console.log("error");
		});
	$scope.ifDesc = function () {
		var by;
	    	if($scope.desc)by='-title';
		else by='title';
		return by;
	};
	$scope.showRating = function (id) {
	    	if($scope.desc)id=$scope.movies.length-1-id;
	    	$state.go('ratings', {id: $scope.movies[id].id, title: $scope.movies[id].title});
	};
}]);

App.controller('ratingsController',['$state', '$stateParams', '$scope', '$rootScope', '$http', function($state, $stateParams, $scope, $rootScope, $http){

    	$scope.ratings = [];
	$scope.id = $stateParams.id;
	$scope.title = $stateParams.title;
	$scope.loadRatings = function(){
		$http.get($rootScope.$restpath + 'movies/' + $scope.id + '/ratings', {headers: {'Content-Type' : 'application/json', 'Cache-Control' : 'no-cache'}})
			.success(function (response) {
				$scope.ratings = response;
				$scope.calcAverage();
			})
			.error(function (data, status, headers, config) {
				console.log("error");
			});
	}
	$scope.loadRatings();
	$scope.calcAverage = function () {
		var sum = 0.00;
		angular.forEach($scope.ratings, function(rating){
			sum +=rating.rating;
		});
		$scope.average = sum/$scope.ratings.length;
	}	
	$scope.addRating = function () {
		$http.post($rootScope.$restpath + 'movies/' + $scope.id + '/ratings', { rating: $scope.newRating }, {headers: {'Content-Type' : 'application/json', 'Cache-Control' : 'no-cache'}})
			.success(function (response) {
				console.log("succes");
			})
			.error(function (data, status, headers, config) {
				console.log("error");
			});
		$scope.loadRatings();
	}
	$scope.films = function(){
		$state.go('movies');
	}
}]);

