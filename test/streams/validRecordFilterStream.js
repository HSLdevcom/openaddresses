var tape = require( 'tape' );
var event_stream = require( 'event-stream' );

var validRecordFilterStream = require( '../../lib/streams/validRecordFilterStream' );

function test_stream(input, testedStream, callback) {
  var input_stream = event_stream.readArray(input);
  var destination_stream = event_stream.writeArray(callback);

  input_stream.pipe(testedStream).pipe(destination_stream);
}

tape( 'valid inputs must have non-blank values for LON, LAT, STREET, and NUMBER properties', function ( test ){
  var inputs = [
    {LON: '',  LAT: '2', STREET: '3', NUMBER: '4' },
    {          LAT: '2', STREET: '3', NUMBER: '4' },
    {LON: '1', LAT: '',  STREET: '3', NUMBER: '4' },
    {LON: '1',           STREET: '3', NUMBER: '4' },
    {LON: '1', LAT: '2', STREET: '',  NUMBER: '4' },
    {LON: '1', LAT: '2',              NUMBER: '4' },
    {LON: '1', LAT: '2', STREET: '3', NUMBER: ''  },
    {LON: '1', LAT: '2', STREET: '3',             },
    {LON: '1', LAT: '2', STREET: '3', NUMBER: '4' },
  ];

  var expecteds = [
    {LON: '1', LAT: '2', STREET: '3', NUMBER: '4' }
  ]

  var stream = validRecordFilterStream.create();

  test_stream(inputs, stream, function(err, actual) {
    test.deepEqual(actual, expecteds, 'only inputs with all properties should pass filter');
    test.end();
  });

});

tape('complete record but house number is literal word `null`, `undefined`, or `unavailable` should return false', function(test) {
  var inputs = [
    {LON: '1', LAT: '2', NUMBER: 'NuLl', STREET: 'Street'},
    {LON: '1', LAT: '2', NUMBER: 'uNdEfInEd', STREET: 'Street'},
    {LON: '1', LAT: '2', NUMBER: 'uNaVaIlAbLe', STREET: 'Street'}
  ];

  var stream = validRecordFilterStream.create();

  test_stream(inputs, stream, function(err, actual) {
    test.deepEqual(actual, [], 'no records should have passed filter');
    test.end();
  });

});

tape('complete record but street contains literal word `null`, `undefined`, or `unavailable` should return false', function(test) {
  var inputs = [
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'NuLl Name St' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'South NULL St' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'South Name null' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'uNdEfInEd Name St' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'South UNDEFINED St' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'South Name undefined' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'uNaVaIlAbLe Name St' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'South UNAVAILABLE St' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'South Name unavailable' }
  ];

  var stream = validRecordFilterStream.create();

  test_stream(inputs, stream, function(err, actual) {
    test.deepEqual(actual, [], 'no records should have passed filter');
    test.end();
  });

});

tape('street with substring `null`, `undefined`, or `unavailable` but not on word boundary should return true', function(test) {
  var inputs = [
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'Snull Street Nulls' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'Sundefined Street Undefineds' },
    { LON: '1', LAT: '2', NUMBER: 'Number', STREET: 'Sunavailable Street Unavailables' }
  ];

  var stream = validRecordFilterStream.create();

  test_stream(inputs, stream, function(err, actual) {
    test.deepEqual(actual, inputs, 'all records should have passed filter');
    test.end();
  });

});
