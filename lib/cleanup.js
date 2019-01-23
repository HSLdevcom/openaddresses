var _ = require('lodash');

function removeLeadingZerosFromStreet(token) {
  return token.replace(/^(?:0*)([1-9]\d*(st|nd|rd|th))/,'$1');
}

const directionals = ['NE', 'NW', 'SE', 'SW'];

function capitalizeProperly(token){
  const lowercase = token.toLowerCase();
  const uppercase = token.toUpperCase();

  // token is a directional, return uppercase variant
  if (directionals.includes(uppercase)) {
    return uppercase;
  }

  // token is all lowercase or all uppercase, return capitalized variant
  if (token === lowercase || token === uppercase) {
    return _.capitalize(token);
  }

  return token;
}

function cleanupStreetName(input) {
  return capitalizeProperly(
    input.split(/\s/)
    .map(removeLeadingZerosFromStreet)
    .filter(function(part){
      return part.length > 0;
    }).join(' ')
  );
}

module.exports = {
  streetName: cleanupStreetName
};
