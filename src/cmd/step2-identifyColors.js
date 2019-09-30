async function quickstart() {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.imageProperties('http://image1.lacoste.com/dw/image/v2/AAQM_PRD/on/demandware.static/Sites-FR-Site/Sites-master/default/L1312_240_24.jpg?sw=458&sh=443');
  console.log(result.imagePropertiesAnnotation.dominantColors);
  const dominantColors = result.imagePropertiesAnnotation.dominantColors.colors;
  console.log('dominantColors:');
  dominantColors.forEach(label => console.log(label));
}
quickstart();
