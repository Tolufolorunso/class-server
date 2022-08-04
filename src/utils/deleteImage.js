const fs = require('fs');
const path = require('path');

function deleteImg({ imageLocation, res }) {
  const directory = path.join(__dirname, '../..', 'uploads');

  console.log(directory);

  try {
    fs.unlinkSync(`${directory}/${imageLocation}`);
  } catch (error) {
    // res.status(500).json({
    //   status: false,
    //   errorMessage: 'Image not found. Nothing to delete',
    // })
    console.log(error.message);
  }
}
module.exports = deleteImg;
