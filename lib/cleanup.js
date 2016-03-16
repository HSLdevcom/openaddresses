function removeLeadingZerosFromStreet(token) {
  return token.replace(/^(?:0*)([1-9]\d*(st|nd|rd|th))/,'$1');
}

// expand '-str.' to '-strasse'
// note: '-straße' is only used in Germany, other countries like
// switzerland use 'strasse'.
function expandGermanicStreetSuffixes(token) {
  return token.replace(/([^\s]+)str\.?$/i,'$1strasse');
}

function cleanupStreetName(input) {
  var street_parts = input.split(' ');
  street_parts = street_parts.map(expandGermanicStreetSuffixes);
  return street_parts.map(removeLeadingZerosFromStreet).join(' ');
}

module.exports = {
  streetName: cleanupStreetName
};
