
myApp.controller('TeamCtrl',['$scope', '$rootScope','$http', '$location',function($scope, $rootScope, $http, $location) {


    //refresh function definition
    var refreshTeamManagement = function(){
	    $http.get('/teamlist').then(function(response){
	    	$scope.teamlist=response.data;
	    	//console.log("$http.get teamlist")
	    	$scope.team ={};
	    })
    };

	//main code - only calls refresh function
   	refreshTeamManagement();


    //CREATEs new team in collection
    $scope.addTeam = function(){
    	console.log($scope.team);
    	$http.post('/teamlist',$scope.team).then(function(response){
    		console.log(response.data);
    		refreshTeamManagement();
    	})
    };

    //READs team info to send to view
    $scope.edit = function(id){
    	console.log("\nRead data from server for...\n");
        $http.get('/teamlist/'+id).then(function(response){
            $scope.team=response.data;
            console.log($scope.team);
        })
    };

    //UPDATEs team name
    $scope.update = function(){
    	console.log("Sending update to server for  "+$scope.team.name);
    	$http.put('/teamlist/'+$scope.team._id, $scope.team).then(function(response){
    		refreshTeamManagement();
    	})
    } 

    //DELETEs team from collection
    $scope.remove = function(id){
    	console.log("Deleting team w/ ID \t" + id);
    	$http.delete('/teamlist/'+id).then(function(response){
    		refreshTeamManagement();
    		});
    };
    //
    $scope.deselect = function(){$scope.team = "";};

    //Can I call edit() here instead of rewriting it?
    //Team roster viewer
    $scope.teamInfoClick = function(id){
    	console.log("Viewing roster for");
    
    	//go to server to get entire teams document
    	$http.get('/teamlist/'+id).then(function(response){
            //Send that team object to the view for parsing to use the name. 
            $rootScope.teamObject=response.data;
            //print team name
            console.log("\t"+$rootScope.teamObject.name);
        });

        //Now go find every player who's team_id matches the $rootScope.teamObject._id
        //make a GET request for /rosterFinder+id - then expose and endpoint for rosterFinder
        $http.get('/rosterFinder/'+id).then(function(response2){
        	$rootScope.rosterObject = response2.data;            
        });
    };
;

    $scope.emailRoster = function(id, name, address){ //pass team's _id
        console.log("Retrieving roster for");
    
        var dataObject = {
            id: id,
            name: name,
            address: address
        };
        //print data
        console.log("\n\n\n");
        console.log(dataObject.id);
        console.log(dataObject.name);
        console.log(dataObject.address);

        

        //Then call roster-finder to get the roster and store it.
        $http.get('/rosterFinder/'+id).then(function(response){
            $rootScope.rosterRootScope=response.data;
            //console.log($rootScope.rosterRootScope);
        }).

        //so the server now has the document to send...
        //then do the get request to send the email to the specific recipient

        then($http.get('/emailRecipientPage/'+address).then(function(response){
            console.log("\nResponse from .sendmail() is...");
            console.log(response);
        }));

        /*
        //Then call roster-finder to get the roster and store it.
        $http.get('/rosterFinder/'+id).then(function(response){
            $rootScope.rosterRootScope=response.data;
            //console.log($rootScope.rosterRootScope);
        }); 

        //so the server now has the document to send...
        //then do the get request to send the email to the specific recipient

        $http.get('/emailRecipientPage/'+address).then(function(response){
            console.log("\nResponse from .sendmail() is...");
            console.log(response);
        });
        */


    }   

}]);