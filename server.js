// Strict mode prevents certain actions from being taken (such as accidentally creating a global variable)
'use strict';

const Hapi = require('@hapi/hapi');

const Routes = require('./src/routes/routes');

const init = async () => {
    const server = Hapi.Server({
        host: 'localhost',
        port: 3000
    });

    server.route(Routes);

    await server.start();
    console.log(`Server started on: ${server.info.uri}`);

}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
