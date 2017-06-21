
myApp.controller('PlayerCtrl',['$scope', '$rootScope','$http', '$location', function($scope, $rootScope, $http, $location) {
    
    //define player refresh function
    var refreshPlayerManagement = function() {
	    $http.get('/playerlist').then(function(response){
	    	$scope.playerlist=response.data;
	    	//console.log("Browser GOT the playerlist")
	    	$scope.player ={};
	    })
	};

	//Main Code - only calls refresh function
	refreshPlayerManagement();


    /*
    	Player Manipulation functions
    */
    //CREATE player in collection
    $scope.addPlayer = function(){
    	console.log("New Player added... Object below");
    	$http.post('/playerlist', $scope.player).then(function(response){
    		console.log(response.data);
    		refreshPlayerManagement();
    	});
    };

    //Can I make one function that combines all three of these????
    //READ player from collection
    //when you click 'edit' this populates the input box with the player
    $scope.editPlayer = function(id){
    	console.log("Editing player w/ ID "+id);
        $http.get('/playerlist/'+id).then(function(response){
            $scope.player=response.data
        });
    };

    //READ
    //When you click on player's stats button - this sends entire player object to view for parsing/display
    $scope.playerStatsModal = function(playerID){
    	$http.get('/playerlist/'+playerID).then(function(response){
			$rootScope.playerObject=response.data;
    		console.log("\nShowing stats of below object");
    		console.log($rootScope.playerObject);
    	});
    };

    //READ
    //When you click players trade button - this sends entire player object to view so it can display the name
    $scope.clickedTrade = function(playerID){
    	$http.get('/playerlist/'+playerID).then(function(response){
    		$rootScope.playerObject=response.data;
    		console.log("Clicked trade launcher for player  ");
    		console.log($rootScope.playerObject);
    	})
    }

    //UPDATEs player name and team
    $scope.updatePlayer = function(team, player){
    	//Combine team and player object to send in PUT request
    	var teamAndPlayer = {
    		team:team,
    		player: player};

    	//Send PUT request to server
    	$http.put('/playerlist/'+player._id, teamAndPlayer).then(function(response){
    	console.log("Updating "+player.name+" of "+team.name);
    		refreshPlayerManagement();
    	});
    };

    //DELETEs player from collection
    $scope.removePlayer = function(id){
    	console.log("Deleting Player with ID "+id);
    	$http.delete('/playerlist/'+id).then(function(response){
    		refreshPlayerManagement();
    	});
    };

    //Clears input boxes - clears selection in player view
    $scope.deselectPlayer = function(){$scope.player = ""};

}]);