// Controller to manage navigation buttons, and email
myApp.controller('NavCtrl',['$scope', '$rootScope','$http', '$location', function($scope, $rootScope, $http, $location) {
    
    // Navigation functions
    $scope.navToIndex = function(){window.location = "index.html"};

    $scope.navToTeamMgmt = function(){window.location = "teamManagement.html"};

    $scope.navToPlayerMgmt = function(){window.location = "playerManagement.html"};

    $scope.navToContactUs = function(){window.location = "contactUs.html"};

    $scope.checkNavCtrlr = function(){console.log("Nav Controller here...")};

    $scope.nodemailerTestPage = function(){window.location = 'nodemailerTestPage.html'};

    $scope.nodemailerTest = function() {
        console.log("Email Button Cicked...");
        //now transfer to app to initiate email....
        $http.get('/nodemailerTestPage').then(function(response){
        	console.log("\nResponse from .sendmail() is...");
        	console.log(response);
        });
    };

    $scope.emailRecipient = function(recipient){
        //  send http "GET" request to server.  Endpoing exposed in server.js
        $http.get('/emailRecipientPage/'+recipient).then(function(response){
        	console.log("\nResponse from .sendmail() is...");
        	console.log(response);
        });
    }
}]);
