'use strict';

const through = require( 'through2' );

const peliasModel = require( 'pelias-model' );

/*
 * Create a stream of Documents from valid, cleaned CSV records
 */
function createDocumentStream(id_prefix, stats, language) {
  language = language || 'default';

  return through.obj(
    function write( record, enc, next ){
      try {
        var model_id = record.ID || record.HASH;
        model_id = id_prefix + ':' + model_id;
        var name = record.STREET + ' ' + record.NUMBER;
        var addrDoc = new peliasModel.Document( 'openaddresses', 'address', model_id )
            .setName( language, name )
            .setCentroid( { lon: record.LON, lat: record.LAT } );

        if (language !== 'default') {
          addrDoc.setName( 'default', name );
        }
        addrDoc.setAddress( 'number', record.NUMBER );

        addrDoc.setAddress( 'street', record.STREET );

        if (record.POSTCODE) {
          addrDoc.setAddress( 'zip', record.POSTCODE );
        }
        /* very simple & fast deduplication
        const newHash=record.NUMBER+record.STREET+record.POSTCODE;
        if (newHash !== prevHash) {
          this.push( addrDoc );
          prevHash = newHash;
          } */
        this.push( addrDoc );
      }
      catch ( ex ){
        stats.badRecordCount++;
      }
      next();
    }
  );
}

module.exports = {
  create: createDocumentStream
};
