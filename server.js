'use strict'
 
const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
 
const server = new Hapi.Server();
 
server.connection({
    host: '127.0.0.1',
    port: 3000
});
 
// Register vision for our views
server.register(Vision, (err) => {
    server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: __dirname,
        path: './views',
    });
});
 
server.start((err) => {
    if (err) {
        throw err;
    }
 
    console.log(`Server running at: ${server.info.uri}`);
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        Request.get('https://www.eventbriteapi.com/v3/categories/?token=QMDD5PQRMVTX7TZHMHZO', function (error, response, body) {
            if (error) {
                throw error;
            }
 
            const data = JSON.parse(body);
            reply.view('index', { result: data });
        });
    }
});
 
// A simple helper function that extracts team ID from team URL
Handlebars.registerHelper('categoriesID', function (categoriesUrl) {
    return categoriesUrl.slice();
});

server.route({
    method: 'GET',
    path: '/categories/{id}',
    handler: function (request, reply) {
        const categoriesID = encodeURIComponent(request.params.id);
 
        Request.get(`https://www.eventbriteapi.com/v3/categories/${categoriesID}/?token=QMDD5PQRMVTX7TZHMHZO`, function (error, response, body) {
            if (error) {
                throw error;
            }
 
            const result = JSON.parse(body);
                reply.view('categories', { result: result});
            
        });
    }
});
