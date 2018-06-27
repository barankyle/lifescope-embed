let mongodb = require('mongodb');

let app = require('./app');
let sysUtils = require('./utils');


module.exports = (async function() {
	var server = app.listen(process.env.PORT || CONFIG.port, process.env.HOST || CONFIG.host, function() {
		console.log('\niframely is running on ' + server.address().address + ':' + server.address().port);
		console.log('API endpoints: /oembed and /iframely; Debugger UI: /debug\n');
	});

	let mongo;

	try {
		mongo = await mongodb.MongoClient.connect(CONFIG.mongo.address, CONFIG.mongo.options);
	} catch(err) {
		console.log(err);
		mongo = null;
	}

	global.env = {
		mongo: mongo
	};

	if (CONFIG.ssl) {
		require('https').createServer(CONFIG.ssl, app).listen(CONFIG.ssl.port);
	}

	// console.log('');
	// console.log(' - support@iframely.com - if you need help');
	// console.log(' - twitter.com/iframely - news & updates');
	// console.log(' - github.com/itteco/iframely - star & contribute');

	if (!CONFIG.DEBUG) {
		var GracefulServer = require('graceful-cluster').GracefulServer;
		new GracefulServer({
			server: server,
			log: sysUtils.log,
			shutdownTimeout: CONFIG.SHUTDOWN_TIMEOUT
		});
	}

	return Promise.resolve(global.env);
})()
	.catch(function(err) {
		console.log(err);
		process.exit(1);
	});