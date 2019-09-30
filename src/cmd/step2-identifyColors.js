const { Product } = require('../../sequelize');
const vision = require('@google-cloud/vision');

// Get dominant color from Google Vision API
async function getDominantColor(product) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.imageProperties('https:' + product.photo);
  const dominantColors = result.imagePropertiesAnnotation.dominantColors.colors;
  return {...product, dominantColor: dominantColors[0].color, imagePropertiesAnnotation: result.imagePropertiesAnnotation};
}


Product.findAll(
  {attributes: ['id', 'photo']}
).then(function(response){
    //response.map((p) => console.log(p.dataValues));
    Promise.all(response.map(product =>
      getDominantColor(product.dataValues)
      .then(
        (data) => {
          Product.update(
            { dominantColor: data.dominantColor, imagePropertiesAnnotation: data.imagePropertiesAnnotation },
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
