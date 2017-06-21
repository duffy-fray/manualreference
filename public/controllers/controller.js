
var myApp = angular.module('myApp',[]);

myApp.controller('AppCtrl',['$scope', '$rootScope','$http', '$location',function($scope, $rootScope, $http, $location) {

    $http.get('/playerlist').then(function(response){
        $scope.playerlist=response.data;
        $scope.player ={};
    });

    $http.get('/teamlist').then(function(response){
        $scope.teamlist=response.data;
        $scope.team ={};
    });
}]);


/*
1)  Change player stats from modal - done
2)  Launch modal to add player with details at same time 
3)  Business logic
    a.  Take collection – email out a team and their roster.
    b.  SMTP – (will need library)
    c.  Build dynamic HTML to populate team roster
    d.  Populate from, to, subject, etc.
*/