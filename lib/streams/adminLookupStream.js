var through = require( 'through2' );
var logger = require( 'pelias-logger' ).get( 'openaddresses' );

function createAdminLookupStream(config,adminLookup) {
  // disable adminLookup with empty config
  if (!config.imports || !config.imports.openaddresses ||
      !config.imports.openaddresses.adminLookup) {
    return through.obj(function (doc, enc, next) {
      next(null, doc);
    });
  }
  logger.info( 'Setting up admin value lookup stream.' );

  var pipResolver = adminLookup.createLocalWofPipResolver(
    null, config.imports.openaddresses.adminLayers);
  return adminLookup.createLookupStream(pipResolver);
}

module.exports = {
  create: createAdminLookupStream
};
