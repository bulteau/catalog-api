const { Product } = require('../../sequelize');
const vision = require('@google-cloud/vision');
const { rgb2lab } = require('colour-proximity');

// Get dominant color from Google Vision API
async function getDominantColor(product) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.imageProperties('https:' + product.photo);
  const dominantColors = result.imagePropertiesAnnotation.dominantColors.colors;
  return {...product, dominant_color: dominantColors[0].color, image_properties_annotation: result.imagePropertiesAnnotation};
}


Product.findAll(
  {attributes: ['id', 'photo']}
).then(function(response){
    //response.map((p) => console.log(p.dataValues));
    Promise.all(response.map(product =>
      getDominantColor(product.dataValues)
      .then(
        (data) => {
          // Calculate using Hunter Lab Color space https://en.wikipedia.org/wiki/CIELAB_color_space#Hunter_Lab
          let colorLab = rgb2lab([
            data.dominant_color.red,
            data.dominant_color.green,
            data.dominant_color.blue]
          );
          // Save Hunter Lab Color space
          // Save also raw data coming from Google Vision API
          Product.update(
            { dominant_color_l: parseFloat(colorLab[0]),
              dominant_color_a: parseFloat(colorLab[1]),
              dominant_color_b: parseFloat(colorLab[2]),
              image_properties_annotation: data.image_properties_annotation },
            { where: { id: data.id } }
          );
        }
      )
    ))
    .then(data => {
      console.log(`Find ${data.length} dominant colors product`);
    });
})
.catch(function(error){
    console.log(error);
});
