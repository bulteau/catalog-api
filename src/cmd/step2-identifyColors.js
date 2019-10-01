const { Product } = require('../../sequelize');
const vision = require('@google-cloud/vision');
const { rgb2lab } = require('colour-proximity');

// Get dominant color from Google Vision API
async function getAndUpdateDominantColor(product) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.imageProperties('https:' + product.photo);
  const dominantColors = result.imagePropertiesAnnotation.dominantColors.colors;
  let colorLab = rgb2lab([
    dominantColors[0].color.red,
    dominantColors[0].color.green,
    dominantColors[0].color.blue]
  );
  return await Product.update(
    { dominant_color_l: parseFloat(colorLab[0]),
      dominant_color_a: parseFloat(colorLab[1]),
      dominant_color_b: parseFloat(colorLab[2]),
      image_properties_annotation: result.image_properties_annotation },
    { where: { id: product.id } }
  );
}

Product.findAll(
  {attributes: ['id', 'photo']}
).then(function(response){
    Promise.all(response.map(product =>
      getAndUpdateDominantColor(product.dataValues)
    ))
    .then(data => {
      console.log(`Find ${data.length} dominant colors product`);
    });
})
.catch(function(error){
    console.log(error);
});
