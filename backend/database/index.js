const Datastore = require('nedb');

const roomsDb = new Datastore();
roomsDb.loadDatabase();

module.exports = roomsDb;