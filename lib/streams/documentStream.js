var through = require( 'through2' );
var peliasModel = require( 'pelias-model' );

/*
 * Create a stream of Documents from valid, cleaned CSV records
 */
function createDocumentStream(id_prefix, stats, language) {
  /**
   * Used to track the UID of individual records passing through the stream
   * created by `createRecordStream()`.  See `peliasModel.Document.setId()` for
   * information about UIDs.
   */
  language = language || 'default';

  return through.obj(
    function write( record, enc, next ){
      try {
        var model_id = id_prefix + ':' + record.ID;
        var name = record.NUMBER + ' ' + record.STREET;
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
