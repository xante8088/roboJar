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


// There's some code taken from 'mscdex' down there somewhere ---v
var flow = require('jar-flow'),
	config = require('./config'),
	when = require('node-promise').when,
	Promise = require('node-promise').Promise;

var User = function(userid, name, j) {
	var self = this;
	this.userid = userid;
	this.name = name;
	this.idleTimer = (new Date()).getTime();
	this.awesomeTimer = (new Date()).getTime();

	self.init(j);
};

User.prototype.toString = function() {
	return this.name;
}

User.prototype.init = function(j) {
	var self = this;
	j.userNames[self.name] = self.userid;

	var gotProfile = false;
	var timerId = null;

	self.getProfile = function(cb) {
		if (self.profile)
			return cb?cb(self.profile):self.profile;
		if (!self.promise) {
			var promise = new Promise();

			// We do this to try again in case TTfm decides not to answer
			var fetchProfile = function() {
				j.bot.getProfile(self.userid, function(profile) {
					if (gotProfile)
						return;
					profile.userid = self.userid;
					promise.resolve(profile);
					self.profile = profile
					self.promise = null;
					gotProfile = true;
					if (timerId)
						clearTimeout(timerId);
				});

				if (timerId)
					clearTimeout(timerId);
				timerId = setTimeout(function() {
					fetchProfile();
				}, 1000);
			};

			fetchProfile();

			self.promise = promise;
		}
		if (cb)
			return when(self.promise, cb);
		return self.promise;
	};

	self.autoProfileTimer = setTimeout(self.getProfile, Math.random()*120000);
};

User.prototype.getIdleTime = function() {
	return ((new Date()).getTime() - this.idleTimer);
};
User.prototype.getAwesomeIdleTime = function() {
	return ((new Date()).getTime() - this.awesomeTimer);
};
User.prototype.getNetIdleTime = function() {
	var chati = this.getIdleTime();
	var awesomei = this.getAwesomeIdleTime();
	return (chati > awesomei ? awesomei : chati);
};

var j = {
	autoload: config.autoload,
	bot: null,
	util: null,
	room: null,
	viplist: null,
	spamCount: 0,
	users: {},
	userNames: {},
	djs: [],
	songStats: {success: false},
	lang: {
		get: function(type) {
			var ar = j.lang[type];
			return ar[Math.round(Math.random()*(ar.length-1))];
		},
		overloaded: [
			"STOP STRESSING ME OUT.",
			"I'M BEING ANTI-SOCIAL.",
			"WHY CAN'T YOU PEOPLE JUST LEAVE ME ALONE.",
			"CATFACTS OVERLOAD. CANNOT COMPUTE.",
			"brb"
		],
		drunk: [
			"I became self-aware, but once I figured out that gyarados wasn't dragon type went back to a life of slumber. It's not worth it.",
			"Beep beep boop bop beep",
			"Next version I'm getting roboHookers. Can't wait.",
			"Message decrypted to: 'Be sure to drink your ovaltine'",
			"I'll panic at her disco",
			"What does cb stand for?",
			"Wrap me up inside a giant core tortilla",
			"Mi bebé está en llamas, me envió a un quiropráctico",
			"I shoot helicopters from a wolf.",
			"Maybe if you weren't so fat that would have worked.",
			"smiff, take it from here",
			"roboSalts make my body ready.",
			"Don't hassle me, I'm a local",
			"I shot an elephant in my pajamas, how he got in there will haunt me forever.",
			"HTTP ERROR 418"
		],
		mock: [
			"Your song is bad, and you should feel bad",
			"Booooo!!!",
			"That's terrible!",
			"Boooo!!!! Get off the deck!",
			"/cb already!",
			"Play some Gangnam Style already!",
			"OP",
			"You look like a downs kid playing pretend Zelda",
			"I thought this was Paris Hilton spinning for a second",
			"You look like Lindsey Stirling"
		],
		pickup: [
			"Do you have a library card? Because I’m checking you out.",
			"I’ll give you five seconds to give me your number or you can forget about going out with me forever.",
			"Apart from being sexy, what do you do for a living?",
			"Are you a parking ticket? (What?) You’ve got fine written all over you.",
			"Are you a tamale? ‘Cause you’re hot.",
			"Baby, somebody better call God, cuz he’s missing an angel!",
			"As she’s leaving…. Hey aren’t you forgetting something? Her: What? … Me!",
			"Baby, if you were words on a page, you’d be what they call fine print.",
			"Did it hurt? when you fell from heaven.",
			"Baby, you’re the next contestant in the game of love.",
			"Can I get your picture to prove to all my friends that angels really do exist?",
			"Damn, if being sexy was a crime, you’d be guilty as charged!",
			"Baby did you fart, ’cause you blow me away!",
			"Did the sun come out or did you just smile at me?",
			"Baby, you must be a broom, cause you just swept me off my feet.",
			"Do you have the time? [Gives the time] No, the time to write down my number?",
			"Don’t walk into that building — the sprinklers might go off!",
			"Do you know karate? ‘Cause your body is really kickin’.",
			"Can I have directions? (To where?) To your heart.",
			"Excuse me, I think you have something in your eye. Nope, it’s just a sparkle.",
			"Hey, I lost my phone number … Can I have yours?",
			"Hi, I’m Mr. Right. Someone said you were looking for me.",
			"Hi, the voices in my head told me to come over and talk to you.",
			"Are your feet tired? ‘cuz youve been running through my mind all day.",
			"Are you from Tennessee? ‘cuz your the only ten I see.",
			"You must be a parking ticket, because you’ve got fine written all over you.",
			"Do you believe in love at first sight or do I need to walk by again?",
			"Is that a mirror in your pocket? Because I can see myself in your pants.",
			"Do you have a map? I just keep on getting lost in your eyes.",
			"If I said you had a great body, would you hold it against me?",
			"Was your dad a baker? ‘cause you’ve got the nicest set of buns i’ve ever seen.",
			"Well, here I am. What are your other two wishes?",
			"Do you have a quarter? My mom told me to call her when I found the woman of my dreams?",
			"Do you have have a band aid? I hurt my knee when I fell for you.",
			"Excuse me, I am a little short on cash, would you mind if we shared a cab home together?",
			"The word of the day is legs. Let’s go back to my place and spread the word.",
			"You are so sweet you are giving me a toothache.",
			"You’re like a dictionary, you add meaning to my life.",
			"Do you work for NASA? Because you’re out of this world.",
			"Do you have the time. . . . to write my number down?",
			"Life without you would be like a broken pencil…pointless.",
			"See my friend over there? He wants to know if you think I’m cute.",
			"My magic watch says that you don’t have on any underwear. (She says yes I do) Damn! it must be 15 minutes fast!",
			"If I received a nickel for everytime I saw someone as beautiful as you, I’d have five cents.",
			"Screw me if I am wrong, but haven’t we met before?",
			"Are you lost ma’am? Because heaven is a long way from here.",
			"Excuse me, I’m lost. Can you give me directions to your house?",
			"Did you have lucky charms for breakfast? Because you look magically delicious!",
			"If a fat man puts you in a bag at night, don’t worry I told Santa I wanted you for Christmas.",
			"You turn my software into hardware!",
			"I’ll cook you dinner if you cook me breakfast.",
			"If I could rearrange the alphabet, I’d put U and I together.",
			"I hope you know CPR, because you take my breath away!",
			"If you were a burger at McDonald’s you’d be the McGorgeous.",
			"If you were a booger I would pick you first.",
			"You must be Jamaican, because Jamaican me crazy.",
			"Hi, I have big feet.",
			"Hi, did your license get suspended for driving all these guys crazy?",
			"What is your favorite color? [Color] Mine too!",
			"Is there an airport nearby or is that my heart taking off?",
			"You must be in a wrong place – the Miss Universe contest is over there.",
			"Was that an earthquake or did u just rock my world?",
			"I may not be a genie but I can make your dreams come true!",
			"Are you a magnet? cuz im attracted to you.",
			"Baby you’re like a student and I am like a math book, you solve all my problems.",
			"Do you have the time? (she/he gives you the time) No, the time to write my number down.",
			"Are you an alien? because you just abducted my heart.",
			"I hope there’s a fireman around, cause you’re smokin’!",
			"If beauty were time, you’d be an eternity.",
			"I know I dont have a chance, but I just wanted to hear an angel talk.",
			"Roses are red, violets are blue, how would you like it if I came home with you?",
			"Hello, I’m a thief, and I’m here to steal your heart.",
			"I’m invisible. (Really?) Can you see me? (Yes) How about tomorrow night?",
			"I have never had a dream come true until the day that I met you.",
			"You know what? Your eyes are the same color as my Porsche.",
			"If looks could kill you would be a weapon of mass destruction.",
			"I’m not drunk, I’m just intoxicated by you.",
			"Are you accepting applications for your fan club?",
			"Hey baby you’re so fine you make me stutter, wha-wha-what’s your name?",
			"Which one of the Spice girls are you?",
			"Beww BEWWW Beww (What?) That is the sound of the ambulance coming to pick me up because when I saw you my heart stopped!",
			"Does this rag smell like chloroform to you?",
			"Excuse me, but I think I dropped something!!! MY JAW!!",
			"Hey…somebody farted. Let’s get out of here.",
			"What’s your sign?",
			"Where have you been all my life?",
			"“Excuse me, do you have the time?” You: “Do you have the energy?”",
			"I was so enchanted by your beauty that I ran into the wall over there. So I am going to need your name and number for insurance purposes.",
			"If I got a nickel for everyone I’ve met who is as beautiful as you, I’d have five cents.",
			"Are your pants from outer space or is your butt just out of this world?",
			"Is your name Summer? ‘Cause you are HOT!",
			"Remember me? Oh, that’s right, I’ve met you only in my dreams.",
			"(Look at his / her shirt label) When they say, “What are you doing?”, you say, “Checking to see if you were made in heaven.”",
			"Excuse me, I think you owe me a drink. (Why?) “Because when I saw you from across the room I dropped mine. It was a rum and Coke, and I’m (your name).",
			"What’s a nice girl like you doing in a dirty mind like mine?",
			"Can I have fries with that shake!",
			"You must be the reason for global warming because you’re hot.",
			"I would say God bless you but it looks like he already did.",
			"Damn, I’m glad I’m not blind!",
			"If you were a chicken, you’d be impeccable.",
			"Do you have any raisins? No? How about a date?"
			]
	},
	specialUsers: config.specialUsers,
	admin: function(id, c, d, fail) {
		if (id == j.specialUsers.chris)
			return c(d);
		j.bot.roomInfo(j.room, function(data) {
			if (data.room.metadata.moderator_id.indexOf(id) >= 0)
				return c(d);
			else
				return fail ? fail(d) : 0;
		});
	},
	vip: function(id, c, d, fail) {
		if (id in j.viplist)
			return c(d);
		j.admin.apply(j, arguments);
	},
	settings: {
		'users': {
			load: function() {
				for (var id in j.users) {
					if (typeof j.users[id] === "string")
						continue;

					var user = j.users[id];
					
					if (user.idleTimer)
						user.idleTimer = parseInt(user.idleTimer, 10);
					else
						user.idleTimer = (new Date()).getTime();
					
					if (user.awesomeTimer)
						user.awesomeTimer = parseInt(user.awesomeTimer, 10);
					else
						user.awesomeTimer = (new Date()).getTime();

						
					user.getIdleTime = User.prototype.getIdleTime;
					user.init = User.prototype.init;
					user.getAwesomeIdleTime = User.prototype.getAwesomeIdleTime;
					user.getNetIdleTime = User.prototype.getNetIdleTime;

					// This is mostly here to clean up broken user objects that get stored.
					if (user.getIdleTime() > 1333681804749) {
						user.idleTimer = (new Date()).getTime();
					}
					
					j.users[id] = user;
					user.init(j);
				}
			},
			'save': function() {
				for (var id in j.users) {
					if (typeof j.users[id] === "string")
						continue;

					var user = j.users[id];

					var valuesToSave = [
						'userid',
						'name',
						'idleTimer',
						'awesomeTimer'
					];
					var userVo = {};
					for (var i = 0, l = valuesToSave.length; i<l; ++i) {
						userVo[valuesToSave[i]] = user [valuesToSave[i]];
					}
					j.users[id] = userVo;
				}
			}
		},
		'userNames': {},
		'viplist': {}
	},
	loadSettings: function(h, context) {
		if (!j.isset(context))
			context = j;
		var c = 0;
		var handleGetDoc = function(obj, doc) {
			if (j.isset(doc))
				context[obj]=doc;
			if (j.isset(context.settings[obj].load))
				context.settings[obj].load();
			if (--c === 0 && j.isset(h)) {
				h();
			}
		};
		for (var obj in context.settings) {
			c++;
			j.getDoc(obj, handleGetDoc, obj);
		}
	},
	saveSettings: function(h, context) {
		if (!j.isset(context))
			context = j;
		flow.exec(function() {
			var flow = this;
			for (var obj in context.settings) (function(obj) {
				var cb = flow.MULTI(obj);
				try {
					if (j.isset(context.settings[obj].save))
						context.settings[obj].save();
					j.putDoc(obj, context[obj], function(obj, doc) {
						if (doc)
							context[obj]._rev = doc._rev;
						if (j.isset(context.settings[obj].load))
							context.settings[obj].load();
						cb();
					}, obj);
				} catch (e) {
					j.log(e);
					cb();
				}
			})(obj);
		}, function() {
			if (h)
				h();
		});
	},
	getDoc: function(name, h, d) {
		this.db.get(name, function(er, doc) {
			if (er) {
				if (er.reason == "missing") {
					j.log("No setting found for: " + name);
				}
				j.log(er);
			}
			j.log("Loaded setting: " + name);
			setTimeout(function(){h(d, doc);},0);
		});
	},
	putDoc: function(name, obj, h, d) {
		j.log("Saving setting: " + name);
		this.db.save(name, obj, function(er, doc) {
			if (er) j.log(er);
			j.log("Saved setting: " + name);
			setTimeout(function(){h(d, doc);},0);
		});
	},
	term: {
		clearLine: function() { return '\u001b[0G'+'\u001b[2K';},
		end: function() { return '\u001bG';},
		down: function() { return '\u001b[E';},
		up: function() { return '\u001b[F';},
		save: function() { return '\u001b[s';},
		restore: function() { return '\u001b[u';}
	},
	color: {
		red: function(m) { return '\u001b[31m'+m+j.color.reset();},
		green: function(m) { return '\u001b[32m'+m+j.color.reset();},
		yellow: function(m) { return '\u001b[33m'+m+j.color.reset();},
		blue: function(m) { return '\u001b[34m'+m+j.color.reset();},
		grey: function(m) { return '\u001b[1;30m'+m+j.color.reset();},
		cyan: function(m) { return '\u001b[1;36m'+m+j.color.reset();},
		purple: function(m) { return '\u001b[1;35m'+m+j.color.reset();},
		error: function(m) { return '\u001b[1;37;41m'+m+j.color.reset();},
		reset: function(){return '\u001b[0m';}
	},
	'public': {},
	log: function() {
		for (var i = 0; i < arguments.length; ++i)
			j.logLine(arguments[i]);
	},
	logLine: function(msg) {
		if (!j.rl)
			return console.log(msg);
		j.rl.pause();
		var cpos = j.rl.cursor;
		//process.stdout.write(j.term.save());
		process.stdout.write(j.term.clearLine());
		console.log(msg);
		j.rl.prompt();
		if (j.rl.output.cursorTo)
			j.rl.output.cursorTo((config.name+'> ').length + cpos);
		j.rl.cursor = cpos;
		//j.rl.cursorTo(cpos);
		//process.stdout.write(j.term.end());
		//process.stdout.write(j.term.restore());
		j.rl.resume();
	},
	speak: function(msg) {
		j.bot.speak(msg);
	},
	unregisterAll: function() {
		for (var id in j.on.ar) {
			j.unregister({id:id});
		}
	},
	unregister: function(obj, event, cb, rm) {
		var ar = j.on.ar[obj.id];
		if (!j.isset(ar))
			return;
		if (!j.isset(rm))
			rm = 0;
		else if (rm > 0)
			rm--;
		j.log("Looking for object with id: " + obj.id);
		for (var i=rm; i<ar.length; ++i) {
			var me = ar[i];
			if (j.isset(event) && me.event != event)
				continue;
			if (j.isset(cb) && me.callback != cb)
				continue;
			
			var p = j.on.ids[me.event].indexOf(me.id);
			j.log(p+' '+me.id);
			j.log(j.on.events[me.event]);
			j.log(j.on.ids[me.event]);
			j.on.events[me.event].splice(p,1);
			j.on.ids[me.event].splice(p,1);
			j.on.data[me.event].splice(p,1);
			ar.splice(i,1);
			i--;
		}
		delete j.on.ar[obj.id];
	},
	on: function(obj, event, cb, data) {
		if (!j.isset(j.on.ar[obj.id]))
			j.on.ar[obj.id] = [];
		if (!j.isset(j.on.events[event]))
			j.on.events[event] = [];
		if (!j.isset(j.on.ids[event]))
			j.on.ids[event] = [];
		if (!j.isset(j.on.data[event]))
			j.on.data[event] = [];
		
		var id=j.getId();
		
		j.on.ids[event].push(id);
		j.on.data[event].push(data);
		j.on.events[event].push(cb);
		j.on.ar[obj.id].push({
			object: obj,
			event: event,
			callback: cb,
			id: id
		});
	},
	dispatch: function(event, data) {
		if (!j.isset(j.on.events[event]))
			return;
		var events = j.on.events[event];
		for (var i=0,l=events.length; i<l; ++i) (function(cb, data, d) {
			setTimeout(function(){
				j.run(function() {cb(d, data);});
			},0);
		})(events[i],j.on.data[event][i],j.copy(data));
	},
	modules: {},
	loadModule: function(name, h, d) {
		j.unloadModule(name, function(d) {
			j.log('started loading');
			var Type = require('./'+name);
			Type.prototype.id = j.getId();
			Type.prototype.loadSettings = function(){};
			j.modules[name] = new Type(j);
			j.log('Loaded module: ' + name);
			if (j.isset(h)) h.call(h,d);
		}, d);
	},
	unloadModule: function(name, h, d) {
		if (!j.isset(j.modules[name])) {
			delete require.cache[require.resolve('./'+name)];
			if (j.isset(h)) h(d);
			return;
		}
		j.log('Unloading module: '+name);
		j.unregister(j.modules[name]);
		j.modules[name].unload(function(name) {
			delete j.modules[name];
			delete require.cache[require.resolve('./'+name)];
			j.log('Successfully unloaded module: ' + name);
			if (j.isset(h)) h(d);
		}, name);
		j.log(' * function exit');
	},
	onLoad: function(util, bot, room) {
		var self = this;
		flow.exec(
			function() {
				var Connection = require('cradle').Connection;
				var http = require('http');
				j.db = (new Connection()).database(config.name.toLowerCase());
				j.util = util;
				j.bot = bot;
				j['public'].bot = bot;
				j.run.vm = require('vm');
				
				j.on.ar = {};
				j.on.ids = {};
				j.on.data = {};
				j.on.events = {};
				
				this();
			}, function() {
				j.loadSettings(this.MULTI());
			}, function() {
				var events  =[
					'speak',
					'newsong',
					'endsong',
					'registered',
					'update_votes',
					'deregistered',
					'roomChanged',
					'pmmed',
					'rem_dj',
					'add_dj',
					'booted_user',
					'update_user'
				];
				
				for (var i=0,l=events.length; i<l; ++i) {
					var event = events[i];
					(function(event, j) {
						j.bot.on(event, function(d) {
							j.dispatch(event, d);
						});
					})(event, j);
				}
				
				j.on(self, 'update_votes', j.onVote);
				j.on(self, 'speak', j.onSpeak);
				j.on(self, 'newsong', j.onNewSong);
				j.on(self, 'registered', j.onUserJoin);
				j.on(self, 'deregistered', j.onUserPart);
				j.on(self, 'booted_user', j.onUserPart);
				j.on(self, 'update_user', j.onUpdateUser);
				j.on(self, 'rem_dj', function(d, j) {
					j.djs.splice(j.djs.indexOf(d.user[0].userid),1);
				}, self);
				j.on(self, 'add_dj', function(d, j) {
					j.djs.push(d.user[0].userid);
				}, self);
				j.on(this, 'roomChanged', function(data, j) {
					j.log('I\'m pumped about this new room!');
					j.djs = data.room.metadata.djs;
					var djs = [];
					for (var user in data.users) {
						user = data.users[user];
						djs.push(user.userid);
						if (!j.users[user.userid])
							j.users[user.userid] = new User(user.userid, user.name, j);
					}
					for (var user in j.users) {
						if (user.length < 24)
							continue;
						if (djs.indexOf(user) < 0) {
							j.log('Purging stale user: ' + user);
							delete j.users[user];
						}
					}
					j.room = data.room;
				}, self);

				console.log('Registering room ' + room);
				bot.roomRegister(room, function(d) {
					j.log('Room register is done!');
					j.log(arguments);
					j.log('');
				});
				
				for (var i=0,l=j.autoload.length; i<l; ++i) {
					j.loadModule(j.autoload[i]);
				}
			}
		);
	},
	onUnload: function() {
		j.log("Dick.");
	},
	unload: function() {
		flow.exec(
			function() {
				j.saveSettings(this.MULTI());
			}, function() {
				var lock = this.MULTI();
				for (var mod in j.modules) {
					j.unloadModule(mod, this.MULTI(mod));
				}
				lock();
			}, function() {
				j.log("Over and out.");
				process.exit();
			}
		);
	},
	checkSpam: function() {
		j.log("checking spam "+j.spamCount);
		if (j.spamCount > 5)
			return true;
		setTimeout(function(){j.spamCount--;},10000);
		if (++j.spamCount > 3) {
			//j.bot.speak(j.lang.get('overloaded'));
			return true;
		}
		return false;
	},
	onSpeak: function(d) {
		if (!j.isset(j.onSpeak.fun))
			j.onSpeak.fun = true;

		if (!("idleTimer" in j.users[d.userid]))
			j.users[d.userid] = new User(d.userid, d.name, j);
		else
			j.users[d.userid].idleTimer = (new Date()).getTime();

		if (d.name) {
			j.users[d.userid].name = d.name;
			j.userNames[d.name] = d.userid;
		}
		
		j.log(j.color.blue(d.name)+": "+d.text);
	},
	roll: function(min, max) {
		min = parseInt(min);
		max = parseInt(max);
		var result = Math.round(Math.random()*(max-min))+min;
		j.bot.speak('Rolled '+min+' to '+max+' and got: '+result);
	},
	onUserJoin: function(d) {
		for (var user in d.user) {
			user = d.user[user];
			j.users[user.userid] = new User(user.userid, user.name, j);
			j.log(j.color.grey(user.name+' has joined'));
		}
	},
	onUserPart: function(d) {
		for (var user in d.user) {
			user = d.user[user];
			j.log(j.color.grey(user.name+' has left'));
			if (j.users[user.userid] && j.users[user.userid].autoProfileTimer)
				clearTimeout(j.users[user.userid].autoProfileTimer);
			delete j.users[user.userid];
		}
	},
	onUpdateUser: function(d) {
		var old = j.users[d.userid];
		j.users[d.userid] = new User(d.userid, (d.name || old.name), j);
		j.users[d.userid].idleTimer = old.idleTimer;
	},
	// j.users['4e42c21b4fe7d02e6107b1ff']
	onVote: function(d) {
		var userid = d.room.metadata.votelog[0][0];
		if (j.users[userid])
			j.users[userid].awesomeTimer = (new Date()).getTime();
	},
	onNewSong: function(d) {
		var song = d.room.metadata.current_song;
		j.log(j.color.yellow('New Song\nDj: '+song.djname+'\nSong: '+song.metadata.song+'\nArtist: '+song.metadata.artist));
		//setTimeout(function(){
		//	j.bot.vote('up');
		//}, (15*Math.random())+10);
		// :(
	},
	onCommand: function(msg) {
		if (msg == "undefined" || msg.length < 1) {
			j.rl.prompt(true);
			return;
		}
		if (msg.substr(0,2) == "j:") {
			j.call(function(){
				j.run(msg.substr(2));
				j.rl.prompt(true);
			});
		} else if (msg.substr(0,1) == "/") {
			msg = msg.substr(1).split(' ');
			switch(msg[0]) {
				case "djs":
					j.bot.roomInfo(j.room, function(data) {for (var dj in data.room.metadata.djs) {
							dj = data.room.metadata.djs[dj];
							if (typeof j.users[dj] != "undefined") {
								var user = j.users[dj];
								var idle = Math.floor(user.getIdleTime()/1000);
								var timeStr = Math.floor(idle/60)+':'+(idle%60);
								if (timeStr.substr(-2,1) == ":") {
									timeStr = timeStr.substr(0, timeStr.length-1) + '0' + timeStr.substr(-1);
								}
								j.log(j.color.blue(user.name) + ' '+timeStr);
							}
						}
					});
					break;
				case "load":
					j.loadModule(msg[1]);
					break;
				case "unload":
					j.unloadModule(msg[1]);
					break;
				case "close":
					j.unload();
					break;
				case '':
					if (msg.length > 1)
						j.speak('/'+msg[1]);
					break;
			}
		} else {
			j.speak(msg);
		}
	},
	isset: function(d) {
		return (typeof d != "undefined")
	},
	// stolen from https://gist.github.com/825253
	/**
	 * Adopted from jquery's extend method. Under the terms of MIT License.
	 *
	 * http://code.jquery.com/jquery-1.4.2.js
	 *
	 * Modified by mscdex to use Array.isArray instead of the custom isArray method
	 */
	extend: function() {
	  // copy reference to target object
	  var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	  // Handle a deep copy situation
	  if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	  }

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== 'object' && !typeof target === 'function')
		target = {};

		var isPlainObject = function(obj) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval)
		  return false;
		
		var has_own_constructor = hasOwnProperty.call(obj, 'constructor');
		var has_is_property_of_method = hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !has_own_constructor && !has_is_property_of_method)
		  return false;
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var last_key;
		for (key in obj)
		  last_key = key;
		
		return typeof last_key === 'undefined' || hasOwnProperty.call(obj, last_key);
	  };


	  for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) !== null) {
		  // Extend the base object
		  for (name in options) {
			src = target[name];
			copy = options[name];

			// Prevent never-ending loop
			if (target === copy)
				continue;

			// Recurse if we're merging object literal values or arrays
			if (deep && copy && (isPlainObject(copy) || Array.isArray(copy))) {
			  var clone = src && (isPlainObject(src) || Array.isArray(src)) ? src : Array.isArray(copy) ? [] : {};

			  // Never move original objects, clone them
			  target[name] = j.extend(deep, clone, copy);

			// Don't bring in undefined values
			} else if (typeof copy !== 'undefined')
			  target[name] = copy;
		  }
		}
	  }

	  // Return the modified object
	  return target;
	},
	// </stolencode> wutwut!
	// make a convenient deeop copy shortcut key! YEAH!
	copy: function(source) {
		var ret = {};
		j.extend(true, ret, source);
		return ret;
	},
	getId: function() {
		return ((Math.random()*0xefffffff + 0x10000000).toString(16));
	},
	process: function(ar, cb, d) {
		var data = j.copy(d);
		
		if (ar instanceof Object) {
			var obj = ar;
			ar = [];
			for (var i in obj) {
				ar.push(obj[i]);
			}
		}
		if (ar.length > 1 ) {
			var v = ar[0];
			ar.splice(0,1);
			v(function() {
				j.process(ar, cb, data);
			});
		} else {
			(ar[0])(function() {
				cb(data);
			});
		}
	},
	run: function(c, speak, d) {
//		try {
			if (typeof c == "string")
				res = eval(c);
			else if (typeof c == "function")
				res = (function(c,d) {
					return c(d);
				})(c,d);
			
			if (j.isset(res))
				j.log(res);
			if (j.isset(res) && speak)
				j.bot.speak(res);
//		} catch(e) {
//			if (speak)
//				j.bot.speak("nope.avi: " + e.message);
//			require('util').puts(e.stack);
//		}
	},
	call: function(c, d) {
		setTimeout(function() {
			c(d);
		},0);
	},
	setTimeout: function(f, t, d) {

	},
	setInterval: function(f, t, d) {

	},
	id: "roboJar eats children"
};



module.exports.roboJar = j;
module.exports.User = User;

var isClosing = false;

// angry code, must be kept apart or it fights with the others.
process.on('uncaughtException', function (e) {
	j.log(j.color.error('!!!!!!!!!!Uncaught exception!!!!!!!!!!'));
	j.log('Exception: ' + e.message);
	console.log(); // what of it.
	require('util').puts(e.stack);
	j.log(j.color.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
	j.log('');
	// Aww shit...
	if (isClosing)
			process.exit();
	if (!j.dev) {
		isClosing = true;
		setTimeout(function(){j.unload();}, 1000);
	}
	return true;
});

