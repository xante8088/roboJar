'use strict';

var User = function(userid, name) {
	this.userid = userid;
	this.name = name;
	this.idleTimer = (new Date()).getTime();
	this.getIdleTime = function() {
		return ((new Date()).getTime() - this.idleTimer);
	}
	j.userNames[name] = userid;
}

var j = {
	bot: null,
	util: null,
	room: null,
	users: {},
	userNames: {},
	specialUsers: {
		'docawk': '4e1b661a4fe7d0314a05b6cb',
		'cheep': '4dfff25ba3f75104e306e495',
	},
	settings: ['users', 'userNames'],
	loadSettings: function() {
		for (var i = 0, k = j.settings.length; i<k; ++i) {
			var obj = j.settings[i];
			this.db.get(obj, function(er, doc) {
				if (er) {
					if (er.reason == "missing") {
						j.log("No setting found for: " + obj);
						return;
					}
					throw new Error(JSON.stringify(er));
				}
				j.log("Loaded setting: " + obj);
				j[obj]=doc;
			});
		}
	},
	saveSettings: function(h) {
		var c = j.settings.length;
		for (var i = 0, k = j.settings.length; i<k; ++i) {
			var obj = j.settings[i];
			this.db.save(obj, j[obj], function(er, doc) {
				if (er) throw new Error(JSON.stringify(er));
				j.log("Saved setting: " + obj);
				if (--c == 0) {
					h();
				}
			});
		}
	},
	color: {
		red: function(m) { return '\u001b[31m'+m+j.color.reset();},
		green: function(m) { return '\u001b[32m'+m+j.color.reset();},
		blue: function(m) { return '\u001b[34m'+m+j.color.reset();},
		reset: function(){return '\u001b[0m';}
	},
	'public': {},
	log: function(msg) {
		console.log(msg);
	},
	onLoad: function(util, bot, room) {
		var cradle = require('cradle');
		this.db = new(cradle.Connection)().database('robojar');
		this.loadSettings();
		this.util = util;
		this.bot = bot;
		this.public.bot = bot;
		bot.on('roomChanged',  function(data) {
			for (var user in data.users) {
				user = data.users[user];
				j.users[user.userid] = new User(user.userid, user.name);
			}
			this.room = data.room;
		});
		bot.roomRegister(room);
	},
	onUnload: function() {
		j.log("Dick.");
	},
	unload: function() {
		j.saveSettings(function(){
			j.log("Over and out.");
			process.exit();
		});
	},
	onSpeak: function(d) {
		if (typeof j.users[d.userid] == "undefined") {
			j.users[d.userid] = new User(d.userid, d.name);
		} else j.users[d.userid].idleTimer = (new Date()).getTime();
		if (typeof j.userNames[d.name] == "undefined") {
			j.userNames[d.name] = d.userid;
		}
		if (d.text.substr(0,1) == "/") {
			j.log(j.color.red(d.name + " ran " + d.text));
			if (d.text == "/djs") {
				// check if doc awk is in da house
				var msg = "Idle Tymz: ";
				if (typeof j.users[j.specialUsers.docawk] == "undefined") {
					j.bot.roomInfo(j.room, function(data) {
						for (var dj in data.room.metadata.djs) {
							dj = data.room.metadata.djs[dj];
							if (typeof j.users[dj] != "undefined") {
								var user = j.users[dj];
								var idle = Math.round(user.getIdleTime()/1000);
								if (idle < 300)
									return;
								var timeStr = Math.floor(idle/60)+':'+(idle%60);
								if (timeStr.substr(-2,1) == ":") {
									timeStr = timeStr.substr(0, timeStr.length-1) + '0' + timeStr.substr(-1);
								}
								msg += user.name + ': ' + timeStr + ' :: ';
							} else {
								msg += user.name + ': magic? :: ';
							}
						}
						j.bot.speak(msg);
					});
				}
			}
			return;
		}
		j.log(j.color.blue(d.name)+": "+d.text);
	},
	onUserJoin: function(d) {
		for (var user in d.user) {
			user = d.user[user];
			j.users[user.userid] = new User(user.userid, user.name);
			j.log(j.color.green(user.name+' has joined'));
		}
	},
	onUserPart: function(d) {
		for (var user in d.user) {
			user = d.user[user];
			j.log(j.color.red(user.name+' has left'));
			delete j.users[user.userid];
		}
	},
	onVote: function() {
	},
	onNewSong: function() {
		setTimeout(function(){
			j.bot.vote('up');
		}, (15*Math.random())+10)
	},

	onCommand: function(msg) {
		msg=msg.substr(1,msg.length-3);
		if (msg == "undefined") {
			process.stdout.write("roboJar> ");
			return;
		}
		if (msg.substr(0,2) == "j:") {
			setTimeout(function(){
				try {
					j.log(eval(msg));
				} catch(e) {
					j.util.puts(e.stack);
				}
				process.stdout.write("\nroboJar> ");
			},0);
		} else if (msg.substr(0,1) == "/") {
			msg = msg.substr(1).split(' ');
			switch(msg[0]) {
				case "djs":
					j.bot.roomInfo(j.room, function(data) {for (var dj in data.room.metadata.djs) {
							dj = data.room.metadata.djs[dj];
							if (typeof j.users[dj] != "undefined") {
								var user = j.users[dj];
								var idle = Math.floor(user.getIdleTime()/1000);
								if (idle < 30)
									return;
								var timeStr = Math.floor(idle/60)+':'+(idle%60);
								if (timeStr.substr(-2,1) == ":") {
									timeStr = timeStr.substr(0, timeStr.length-1) + '0' + timeStr.substr(-1);
								}
								console.log(j.color.blue(user.name) + ' '+timeStr);
							}
						}
					});
					//j.log
					break;
				case "close":
					j.unload();
					break;
			}
		} else {
			j.bot.speak(msg);
		}
	}
};



module.exports.roboJar = j;
