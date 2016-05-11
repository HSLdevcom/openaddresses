var through2 = require( 'through2' );
var _ = require('lodash');

function removeLeadingZerosFromStreet(token) {
  return token.replace(/^(?:0*)([1-9]\d*(st|nd|rd|th))/,'$1');
}

// tokenize on space and remove prefixed 0's in ordinal street names
// eg - `West 03rd Street` -> `West 3rd Street`
function cleanupStreetName(input) {
  var street_parts = input.split(' ');
  return street_parts.map(removeLeadingZerosFromStreet).join(' ');
}

/*
 * create a stream that performs any needed cleanup on a record
 */
function createCleanupStream() {
  return through2.obj(function( record, enc, next ) {
    record.STREET = cleanupStreetName( record.STREET );

    // csvParse will only trim unquoted fields
    // so we have to do it ourselves to handle all whitespace
    Object.keys(record).forEach(function(key) {
      if (typeof record[key].trim === 'function') {
        record[key] = record[key].trim();
      }
    });

    record.NUMBER = _.trimStart(record.NUMBER, '0');

    next(null, record);
  });
}

module.exports = {
  create: createCleanupStream
};
