/*	Obor Specific code should go here
*	Move Mock, Pickup, Other Commands here
*
*
*
*
*
*/

//var config = require('./config');


var Obor = function(j) {
	var self = this;
	this.fun = true;
	this.j = j;
	this.timerId = null;
	
	j.on(this, 'speak', function(d, j) {
		self.handle(j.speak, d);
	}, j);
	
	j.on(this, 'pmmed', function(d, j) {
		j.bot.getProfile(d.senderid, function(profile) {
			d.userid = d.senderid;
			d.name = profile.name;
			self.handle(function(msg) {
				j.bot.pm(msg, d.senderid);
			}, d, true);
		});
	}, j);
	
		var ocmd = d.text.split(' ');
		var cmd = [];
		for (var i in ocmd) {
			if (ocmd[i].length > 0)
				cmd.push(ocmd[i]);
		}
		if (cmd[0] == "!mock") j.vip(d.userid, function() {
			if (cmd.length < 2)
				return reply("I'm not saying that.");
			var user="";
			var userid=null;
			var senderName = d.name;
			for (var i = 1; i < cmd.length; ++i)
				user += cmd[i]+(i+1 === cmd.length?"":" ");

			if (user in j.userNames) {
				userid = j.userNames[user];
			}
			if (user in j.users) {
				userid = user;
				user = j.users[userid].name;
			}
			if (userid === null)
				return reply("Failed to find the user " + user);

			if (userid == config.userid)
				return reply("I'm sorry, I can't let you do that.");
			j.bot.speak(user + ", " + j.lang.get('mock'));
		});
			if (cmd[0] == "!pickup") j.vip(d.userid, function() {
			if (cmd.length < 2)
				return reply("I'm not saying that.");
			var user="";
			var userid=null;
			var senderName = d.name;
			for (var i = 1; i < cmd.length; ++i)
				user += cmd[i]+(i+1 === cmd.length?"":" ");

			if (user in j.userNames) {
				userid = j.userNames[user];
			}
			if (user in j.users) {
				userid = user;
				user = j.users[userid].name;
			}
			if (userid === null)
				return reply("Failed to find the user " + user);

			if (userid == config.userid)
				return reply("I'm sorry, I can't let you do that.");
			j.bot.speak("@" + user + ", " + j.lang.get('pickup'));
	});
};
