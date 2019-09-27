module.exports = (sequelize, type) => {
    return sequelize.define('product', {
      id: {
        type: type.STRING,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: type.STRING
      },
      gender_id: {
        type: type.STRING
      },
      composition: {
        type: type.STRING
      },
      sleeve: {
        type: type.STRING
      },
      photo: {
        type: type.STRING
      },
      url: {
        type: type.STRING
      },
    })
}
