const { Photo, User } = require("../models");
const sharp = require("sharp");

module.exports = {
  // create Photo
  createPhoto({ body, file }, res) {
    const { userId, notes } = body;
    const imageBuffer = file.buffer;
    const contentType = file.mimetype;

    // Compress image using sharp
    sharp(imageBuffer)
      .resize({ width: 800 }) // Resize image to a maximum width of 800px (optional)
      .toBuffer() // Convert image to buffer
      .then((compressedBuffer) => {
        // Save compressed image to database
        return Photo.create({
          userId,
          image: compressedBuffer,
          contentType,
          notes,
        });
      })
      .then((dbPhotoData) => {
        return User.findOneAndUpdate(
          { _id: userId },
          { $push: { photos: dbPhotoData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Photo created but no user with this id!" });
        }
        res.json({ message: "Photo successfully created!" });
      })
      .catch((err) => res.status(500).json(err));
  },

  // get one Photo by id
  getPhotoById({ params }, res) {
    Photo.findOne({ _id: params.id })
      .then((dbPhotoData) => {
        if (!dbPhotoData) {
          return res
            .status(404)
            .json({ message: "No photo data found with this id!" });
        }
        res.json(dbPhotoData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // delete Photo
  deletePhoto({ params }, res) {
    Photo.findOneAndDelete({ _id: params.id })
      .then((dbPhotoData) => {
        if (!dbPhotoData) {
          res
            .status(404)
            .json({ message: "No photo data found with this id!" });
          return;
        }
        // remove photo from user data
        return User.findOneAndUpdate(
          { photos: params.id },
          { $pull: { photos: params.id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Photo deleted but no user with this id!" });
        }
        res.json({ message: "Photo successfully deleted!" });
      })
      .catch((err) => res.status(500).json(err));
  },
};
