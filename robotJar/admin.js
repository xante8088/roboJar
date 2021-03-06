/*
 * roboJar: A turntable.fm bot. Chris "inajar" Vickery <chrisinajar@gmail.com>
 *
 * Redistribution and use in source, minified, binary, or any other forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * Neither the name, roboJar, nor the names of its contributors may be 
 *    used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * Needs more cat facts.
 *
 */

var config = require('./config');


var Admin = function(j) {
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
	
	self.checkSpam = function() {
		j.log("checking spam "+j.spamCount);
		if (j.spamCount > 5)
			return true;
		setTimeout(function(){j.spamCount--;},10000);
		if (++j.spamCount > 3) {
			j.bot.speak(j.lang.get('overloaded'));
			return true;
		}
		return false;
	}
	self.handle = function(reply, d, ispm) {
		if (d.text.substr(0,1) != "!" && d.text.substr(0,1) != "/")
			return;

		var tcmd = d.text.split(' ');
		var cmd = [];
		for (var i in tcmd) {
			if (tcmd[i].length > 0)
				cmd.push(tcmd[i]);
		}
		if (cmd[0] == "!eval") j.admin(d.userid, function() {
			j.log(j.color.purple(d.name + " ran " + d.text));
			j.log(cmd);
			var torun = '';
			for(var i=1, l=cmd.length;i<l;++i) {
				torun += cmd[i] + ' ';
			}
			j.log("Executing: " + j.color.purple(torun));
			setTimeout(function() {
				j.run(torun, true);
			}, 0);
			//*/
		});
		if (cmd[0] == "!load") j.admin(d.userid, function() {
			setTimeout(function() {
				j.run(function() {
					j.loadModule(cmd[1]);
					reply("Loaded module: "+cmd[1]);
				}, true);
			}, 0);
		});
		if (cmd[0] == "!unload") j.admin(d.userid, function() {
			setTimeout(function() {
				j.run(function() {
					j.unloadModule(cmd[1], function(n) {
						reply("Unloaded module: "+n);
					}, cmd[1]);
				}, true);
			}, 0);
		});
		if (cmd[0] == "!escort") j.vip(d.userid, function() {
			if (cmd.length < 2)
				return reply("You must specify a user to boot");
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
			reply(":boot: " + user + " ("+userid+")");
			j.bot.remDj(userid, function(d) {
				if (d.err) {
					reply("Sorry! " + d.err.toString());
				} else {
					reply("It has been done.");
					j.speak(senderName + " drops some justice");
				}
			});
		});
		if (cmd[0] == "!boot") j.vip(d.userid, function() {
			if (cmd.length < 2)
				return reply("You must specify a user to boot");
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
			reply(":boot: " + user + " ("+userid+")");
			j.bot.boot(userid, function(d) {
				if (d.err) {
					reply("Sorry! " + d.err.toString());
				} else {
					reply("It has been done.");
					j.speak(senderName + " drops some justice");
				}
			});
		});
		if (cmd[0] == "!say" || cmd[0] == "!msg") j.vip(d.userid, function() {
			if (cmd.length < 2)
				return reply("I'm not saying that.");
			var msg = "";
			for (var i = 1; i < cmd.length; ++i)
				msg += cmd[i]+(i+1 === cmd.length?"":" ");
			msg = d.name + " says: \"" + msg + "\"";
			j.speak(msg);
			if (ispm)
				reply(msg);
		});
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
 		if (cmd[0] == "!8ball") j.vip(d.userid, function() {
 			if (cmd.length < 2)
				return reply("What do you wish to seek the answer to?");
 			var user="";
 			var userid=null;
 			var senderName = d.name;
//			for (var i = 1; i < cmd.length; ++i)
// 				user += cmd[i]+(i+1 === cmd.length?"":" ");
// 
//			if (user in j.userNames) {
//				userid = j.userNames[user];
// 			}
// 			if (user in j.users) {
// 				userid = user;
// 				user = j.users[userid].name;
// 			}
// 			if (userid === null)
// 				return reply("Failed to find the user " + user);//
// 
// 			if (userid == config.userid)
// 				return reply("I'm sorry, I can't let you do that.");
			j.bot.speak(d.name + ", " + j.lang.get('ball'));
		});
 		if (cmd[0] == "!catfacts") j.vip(d.userid, function() {
 			var user="";
 			var userid=null;
 			var senderName = d.name;

			j.bot.speak(d.name + ", ask smiff");
		});
 		if (cmd[0] == "!101112") j.vip(d.userid, function() {
 			var user="";
 			var userid=null;
 			var senderName = d.name;

			j.bot.speak(d.name + ", show some respect for smiff. The day he nearly died! Never forget!");
//			j.bot.speak(d.name + ", show some respect for smiff. May he rest in peace. will smiff RIP -10/11/12");
		});
		 if (cmd[0] == "/tableflip") j.vip(d.userid, function() {
 			var user="";
 			var userid=null;
 			var senderName = d.name;

			j.bot.speak("/tablefix" + j.lang.get('tableflip'));
		});
		 if (cmd[0] == "/pointfarm") j.vip(d.userid, function() {
 			var user="";
 			var userid=null;
 			var senderName = d.name;

			j.bot.speak(d.name + ", Do you think this is a fucking game? /tableflip");
		});
		 if (cmd[0] == "/pointharvest") j.vip(d.userid, function() {
 			var user="";
 			var userid=null;
 			var senderName = d.name;

			j.bot.speak(d.name + ", You must first run /pointplant");
		});
		 if (cmd[0] == "/pointplant") j.vip(d.userid, function() {
 			var user="";
 			var userid=null;
 			var senderName = d.name;

			j.bot.speak(d.name + " is trying to point farm!!!!");
		});
//		if (cmd[0] =="!seen") && (cmd[0] =="/seen") j.vip(d.userid, function() {
//			var user=""
//			var userid=null;
//			var senderName = d.name;
//			for (var i = 1; i < cmd.length; ++i)
// 				user += cmd[i]+(i+1 === cmd.length?"":" ");
// 
//			if (user in j.userNames) {
//				userid = j.userNames[user];
// 			}
// 			if (user in j.users) {
// 				userid = user;
// 				user = j.users[userid].name;
// 			}
// 			if (userid === null)
// 				return reply("Failed to find the user " + user);//
// 
// 			if (userid == config.userid)
// 				return reply("I'm sorry, I can't let you do that.");		
		
	};
};

Admin.prototype.unload = function(c,d){c(d);}

module.exports = Admin;

