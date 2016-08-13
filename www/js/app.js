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

	var defLatLng = new google.maps.LatLng(-7.7572568,110.3964575);

	var defOptions = {
		center: defLatLng,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	$scope.map = new google.maps.Map(document.getElementById("map"), defOptions);

	//Wait until the map is loaded
	//

	$scope.marker = function(LatLng, markedMap, title, content) {

		var marker = new google.maps.Marker({
			position: LatLng,
			map: markedMap,
			animation: google.maps.Animation.DROP,
			title: title
		});

		var infoWindow = new google.maps.InfoWindow({
			content: content
		});

		return google.maps.event.addListener(marker, 'click', function () {
			infoWindow.open(markedMap, marker);
		});

	};

	$scope.marker(defLatLng, $scope.map, 'Kelurahan Condongcatur', 'Kelurahan Condongcatur');

	$scope.centerOnMe = function() {
		if(!$scope.map) {
			return;
		}

		$scope.loading = $ionicLoading.show({
			content: 'Getting current location...',
			showBackdrop: false
		});

		$scope.loadingShow = function() {
			$ionicLoading.show({
				template: 'Getting current location...'
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

			var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

			$scope.marker(latLng, $scope.map, 'Tempat coding..', 'Here I am!');

			console.log("LatLng: "+latLng);
			$scope.map.setCenter(latLng);
			$scope.loadingHide();

		}, function(error){
			console.log("Could not get location");
		});

	};

});