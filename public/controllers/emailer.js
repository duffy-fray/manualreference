

myApp.controller('EmailCtrl',['$scope', '$rootScope','$http', '$location', function($scope, $rootScope, $http, $location) {
	
    console.log("Email Controller Loaded");
    
    //Email Controller
    $scope.nodemailerTest = function() {
        console.log("BUtton CLicked");
    };
}]);
