var myApp = angular.module('myApp',[]);

myApp.controller('AppCtrl',['$scope', '$rootScope','$http', '$location',function($scope, $rootScope, $http, $location) {

    // Exposes endpoint to access list of player objects
    $http.get('/playerlist').then(function(response){
        $scope.playerlist=response.data;
        $scope.player ={};
    });
    
    // Exposes endpoint to access list of team objects
    $http.get('/teamlist').then(function(response){
        $scope.teamlist=response.data;
        $scope.team ={};
    });
}]);

