angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

// Config router
// 
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('map', {
		url: '/',
		templateUrl: 'templates/map.html',
		controller: 'GoogleMapCtrl'
	});

	$urlRouterProvider.otherwise("/");

})

// Controllers
// 
.controller('GoogleMapCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading) {

	var options = {
		timeout: 10000,
		enableHighAccuracy: true
	};

	var placeLatLng = new google.maps.LatLng(-7.7572568,110.3964575);

	var defOptions = {
		center: placeLatLng,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map"), defOptions);

	// Marker
	//
	var markers = [];

	// Adds a marker to the map and push to the array.
	$scope.addMarker = function(location) {
		var marker = new google.maps.Marker({
			position: location,
			map: map
		});
		markers.push(marker);
	}

	// Sets the map on all markers in the array.
	$scope.setMapOnAll = function(map) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
	}

	// Removes the markers from the map, but keeps them in the array.
	$scope.clearMarkers = function() {
		$scope.setMapOnAll(null);
	}

	// Shows any markers currently in the array.
	$scope.showMarkers = function() {
		$scope.setMapOnAll(map);
	}

	// Deletes all markers in the array by removing references to them.
	$scope.deleteMarkers = function() {
		$scope.clearMarkers();
		markers = [];
	}

	$scope.addMarker(placeLatLng);

	$scope.centerOnMe = function() {
		if(!map) {
			return;
		}

		$scope.clearMarkers();

		$scope.loadingShow = function() {
			$ionicLoading.show({
				template: 'Getting driving direction...'
			}).then(function(){
				console.log("The loading indicator is now displayed");
			});
		};

		$scope.loadingHide = function(){
			$ionicLoading.hide().then(function(){
				console.log("The loading indicator is now hidden");
			});
		};

		$scope.loadingShow();

		$cordovaGeolocation.getCurrentPosition(options).then(function(position){

			var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			console.log('User position: '+userLatLng);

			var directionsService = new google.maps.DirectionsService();
			var directionsRequest = {
				origin: userLatLng,
				destination: placeLatLng,
				travelMode: google.maps.DirectionsTravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.METRIC
			};

			directionsService.route(directionsRequest, function(response, status){
				if(status == google.maps.DirectionsStatus.OK){
					new google.maps.DirectionsRenderer({
						map: map,
						directions: response
					});
				}
			});

			$scope.loadingHide();

		}, function(error){
			console.log("Could not get location");
		});

	};

});