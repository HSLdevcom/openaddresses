var through = require( 'through2' );
var _ = require('lodash');

var logger = require( 'pelias-logger' ).get( 'openaddresses' );

/*
 * Return true if a record has all of LON, LAT, NUMBER and STREET defined
 */
function isValidCsvRecord( record ){
  return hasAllProperties(record) &&
          !houseNumberIsExclusionaryWord(record) &&
          !streetContainsExclusionaryWord(record);
}

/*
 * Return false if record.NUMBER is literal word 'NULL', 'UNDEFINED',
 * or 'UNAVAILABLE' (case-insensitive)
*/
function houseNumberIsExclusionaryWord(record) {
  return ['NULL', 'UNDEFINED', 'UNAVAILABLE'].indexOf(_.toUpper(record['NUMBER'])) !== -1;
}

/*
 * Return false if record.STREET contains literal word 'NULL', 'UNDEFINED',
 * or 'UNAVAILABLE' (case-insensitive)
*/
function streetContainsExclusionaryWord(record) {
  return /\b(NULL|UNDEFINED|UNAVAILABLE)\b/i.test(record['STREET']);
}

function hasAllProperties(record) {
  return [ 'LON', 'LAT', 'NUMBER', 'STREET' ].every(function(prop) {
    return record[ prop ] && record[ prop ].length > 0;
  });
}

/*
 * Create a through2 stream to filter out invalid records
 */
function createValidRecordFilterStream() {
  var invalidCount = 0;
  return through.obj(function( record, enc, next ) {
    if (isValidCsvRecord(record)) {
      this.push(record);
    } else {
      invalidCount++;
    }
    next();
  }, function(next) {
    logger.verbose('number of invalid records skipped: ' + invalidCount);
    next();
  });
}

module.exports = {
  create: createValidRecordFilterStream
};
