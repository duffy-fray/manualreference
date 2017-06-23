// Duffy Fray
// fray.duffy@gmail.com

var express = require('express');
var app = express();

var mongojs = require('mongojs');

var dbteamlist = mongojs('rosterlist',['teamlist']);
var dbplayerlist = mongojs('rosterlist',['playerlist']);

var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

var handlebars = require('handlebars');
var fs = require('fs');

app.use(bodyParser.json());

app.use(express.static(__dirname+"/public"));
app.use(express.static(__dirname+"/public/views"));

var globalBodyText = "instantiated text";
var globalAddress = "fray.duffy@gmail.com";
var globalRosterName = "";
var globalRosterObject;
var globalRosterListForEmail=[];

// Email certificates expire periodically - update here.
var emailCerts = {
	clientID: '408979123361-4laud587e6ljcdgah44u8hgjg0dbm7kl.apps.googleusercontent.com',
	clientSecret: 'Q75MC841i7G4j8QQbnV6A5wV',
	refreshToken: '1/oJjQytXR9sGNzHU7eVGOcb5NMM6CXAf9Xum334yBxwg',
	accessToken: 'ya29.GltuBLChtZ8wJd_icjheyZ0jVmq2FP3qrkGp88HySgk-rX4--QqFY7jROzrcc4peuDSVAm43ZSywTDnlKsic29QEOMTZQLVQMDC2rnDEdFat18GcMnbsRJjEto3H'
};

var EmailTemplate = require('email-templates').EmailTemplate;

// Transporter used for nodemailer - enables SMTP functions
var transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		type: 'OAuth2',
		user: 'duff.fray@gmail.com',
		clientID: emailCerts.clientID,
		clientSecret: emailCerts.clientSecret,
		refreshToken: emailCerts.refreshToken,
		accessToken: emailCerts.accessToken
	}
});
	

app.listen(3000, function(){
	console.log('Server listening on port 3000...\n');
});

// Retrieves list of teams, presents to view. Used with team view
app.get('/teamlist', function (req, res){
	dbteamlist.teamlist.find(function (err, docs){
		res.json(docs);
	})
});

// Retrieves specific team, presents to view.  Used with team view's "edit" button
app.get('/teamlist/:id', function (req, res){
	var id = req.params.id;
	dbteamlist.teamlist.findOne({_id: mongojs.ObjectID(id)}, function (err, doc){
		res.json(doc);
	});
});

// Adds new team
app.post('/teamlist', function (req, res){
	console.log("New team added\n\t"+req.body.name);
	dbteamlist.teamlist.insert(req.body, function(err, doc){
		res.json(doc);
	});
});

// Delete specific team upon request.  Used for "delete" button.
app.delete('/teamlist/:id', function (req, res){
	var id = req.params.id;
	console.log("\nServer rec'd DELETE req for TEAM \t"+id+"\n");
	dbteamlist.teamlist.remove({_id: mongojs.ObjectID(id)}, function (err, doc){
		res.json(doc);
	});
});

// Updates team name.  Used for team view's "update" button
app.put('/teamlist/:id', function (req, res){
    var id = req.params.id;
    console.log(req.body.name);
    dbteamlist.teamlist.findAndModify({query:{_id: mongojs.ObjectId(id)},
    update:{$set:{name: req.body.name}},
    new: true}, function (err, doc){
        res.json(doc);
        console.log("put req");
    })
});

// Retrieves list of players in database.  Presents to player view
app.get('/playerlist', function (req, res){
	dbplayerlist.playerlist.find(function (err, docs){
		res.json(docs);
	});
});

app.get('/playerManagement.html', function (req, res){
	console.log("Serving playerManagement.html");
	res.send('/playerManagement.html');
});

// Adds new player to player database.  Used in player view's "add" button
app.post('/playerlist', function (req, res){
	dbplayerlist.playerlist.insert(req.body, function(err, doc){
		res.json(doc);
		console.log(req.body.name+" added\n");
	});
});

// Delete player from player database.  Used in player view's "delete" button
app.delete('/playerlist/:id', function (req, res){
	var id = req.params.id;
	dbplayerlist.playerlist.remove({_id: mongojs.ObjectID(id)}, function (err, doc){
		res.json(doc);
		console.log("Deleted player with ID "+id);
	});
});

// Adds new player to database.  Used in player view's "add" button
app.post('/playerlist', function (req, res){
	console.log("\t"+req.body.name+"\n");
	dbplayerlist.playerlist.insert(req.body, function(err, doc){
		res.json(doc);
		console.log("Added player\t"+req.body.name+"\n");
	});
});

// Finds specific player in player database.  Used in player view's "edit" button
app.get('/playerlist/:id', function (req, res){
	var id = req.params.id;
	dbplayerlist.playerlist.findOne({_id: mongojs.ObjectID(id)}, function (err, doc){
		res.json(doc);
		console.log("Received and Responded to GET request for "+doc.name+"\n");
	});
});

//  Updates specific player in player database.  Used in player view's "update" button, used in trading modal,
//  and used when updating player stats from modal
app.put('/playerlist/:id', function (req, res){
    var id = req.params.id;
    var teamIDUpdate;
    var teamNameUpdate;

    if (req.body.team._id==undefined){
    	teamIDUpdate = req.body.player.team_id;
    	teamNameUpdate = req.body.player.team_name;
    } else{
    	teamIDUpdate=req.body.team._id;
    	teamNameUpdate = req.body.team.name;
    }
	
	//Find player whit correct ID, update name and update team	
    dbplayerlist.playerlist.findAndModify({query:{_id: mongojs.ObjectId(id)},
    update:{$set:{
    	name: req.body.player.name, 
    	team_id: teamIDUpdate,
    	team_name: teamNameUpdate,
    	position: req.body.player.position,
    	height: req.body.player.height,
    	weight: req.body.player.weight,
    	battingAverage: req.body.player.battingAverage}},
    new: true}, function (err, doc){
        res.json(doc);
        console.log("Received and Responded to PUT request to update "+ req.body.player.name);
    });
});

// Retrieves all players from the database for a specific team
app.get('/rosterFinder/:id', function (req, res){
	var id = req.params.id;
	//find just players who's team_id matches team's _id.
	dbplayerlist.playerlist.find({team_id:id},function(err, docs){
		res.json(docs);
		globalRosterObject = JSON.stringify(docs);

		globalRosterName = docs[0].team_name;

		console.log("Sent roster for " + globalRosterName+" from server to view.\n");
		
		for (var i = docs.length - 1; i >= 0; i--) {
			globalRosterListForEmail[i] = String.fromCharCode(13)+docs[i].name;
		}	

	});
});

app.get('/contactUs.html', function (req, res){
	res.send('/contactUs.html')
});

//  nodemailer test section
app.get('/nodemailerTestPage', function(req, res){
	console.log("app.get('/nodemailerTestPage'");

	var mailOptions = {
		from: 'duff.fray@gmail.com',
		to: 'duffy.fray@snapav.com',
		subject: 'nodemailer worked',
		html: { path: 'public/pages/emailFile.html' }
	};

	transporter.sendMail(mailOptions, function (err, sendMailResponse){
		console.log("\n\n\tAttempting to send test email");
		if(err){
			console.log('\n\tError sending test Email');
			console.log("\n\t");
			res.json(err);

		} else{
			console.log("\n\tEmail Sent to "+ sendMailResponse.accepted);
			res.json(sendMailResponse);
		}
	});
});

// Email a given team's roster to a specified recipient
app.get('/emailRecipientPage/:recipient', function(req, res){
	globalAddress = req.params.recipient;

	var readHTMLFile = function(path, callback){
		fs.readFile(path, {encoding: 'utf-8'}, function (err, html){
			if(err){
				throw err;
				callback(err);
			}
			else {
				callback(null, html);
			}
		});
	};

	readHTMLFile(__dirname+'/public/rosterEmailFile.html',function(err, html){
		var template = handlebars.compile(html);

		var playername=[];

		var replacements={
			teamname: globalRosterName,
			teamObject: globalRosterObject,
			rosterObject: globalRosterListForEmail
			//now add all of the player names here dynamically?
		};

		var htmlToSend = template(replacements);
		var mailOptions = {
			from: 'duff.fray@gmail.com',
			to: globalAddress,
			subject: "You've received a team roster",
			html: htmlToSend
		};

		transporter.sendMail(mailOptions, function (err, sendMailResponse){
			console.log("\n\nSending email..");
			console.log("\t..");
			console.log("\t\t..");
			if(err){
				console.log('\n\tError sending Email\n\t Check refresh token and access token');
				console.log("\n\t");
				console.log("https://developers.google.com/oauthplayground/?code=4/xe7uvCDkbqAGP2_0Ow13A5z4bQOwbg4nlMJ4sByHq6E#");
				console.log(err);	
				res.json(err);

			} else{
				res.json(sendMailResponse);
				console.log("\t\t\tsuccess");
			}
		});
	});
});

//  Thank you for looking.
//      -Duffy
