const { Product } = require('../../sequelize');
const vision = require('@google-cloud/vision');
const { rgb2lab } = require('colour-proximity');
const download = require('image-downloader');

// Get dominant color from Google Vision API
async function getAndUpdateDominantColor(product) {
  // Download Image -
  // This is a bypass for a code error returned by Google Vision API 14 : 'We can not access the URL currently. Please download the content and pass it in.'
  // more information : https://github.com/googleapis/nodejs-vision/issues/270#issuecomment-481064953
  const options = {
    url: 'https:' + product.photo,
    dest: './data/img/' + product.id + '.jpg'
  }
  try {
    const { filename, image } = await download.image(options);
    console.log('\x1b[37m', 'Image Saved to', filename, '\x1b[37m');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    try {
      const [result] = await client.imageProperties(filename);

      if(result.imagePropertiesAnnotation) {
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
            image_properties_annotation: result.imagePropertiesAnnotation },
          { where: { id: product.id } }
        );
      } else {
        console.log(product.id);
        console.log(result);
        return null;
      }
    } catch (e) {
      console.log(e);
    }

  } catch (e) {
    console.log('\x1b[31m', 'Image not found', product.id, '\x1b[37m');
  }
}

Product.findAll(
  {attributes: ['id', 'photo']}
).then(function(response){
    Promise.all(response.map(product =>
      getAndUpdateDominantColor(product.dataValues)
    ))
    .then(data => {
      console.log('\x1b[32m', `Founded ${data.filter((e) => e != null).length} / ${data.length} products with a dominant colors `, '\x1b[37m');
    });
})
.catch(function(error){
    console.log(error);
});
