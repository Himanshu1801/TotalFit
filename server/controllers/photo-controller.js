const { Photo, User } = require("../models");
const sharp = require("sharp");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = {
  // create Photo
  createPhoto(req, res) {
    upload.single("image")(req, res, function (err) {
      const filePath = req.file.path;

      sharp(filePath)
        .resize({ width: 400, height: 400, fit: "contain" })
        .toBuffer(function (err, buffer, info) {
          if (err) {
            console.error("Error processing image:", err);
            return res.status(500).json({ message: "Error processing image" });
          }

          console.log("Image processed successfully");
          console.log("Compressed image buffer length:", buffer.length);

          Photo.create({
            userId: req.body.userId,
            image: buffer,
            contentType: req.file.mimetype,
            notes: req.body.notes,
          })
            .then(() => {

              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error("Error deleting file:", err);
                } else {
                  console.log("File deleted successfully");
                }
              });

              res.json({ message: "Photo uploaded successfully" });
            })
            .catch((error) => {
              console.error("Error saving photo to database:", error);
              res
                .status(500)
                .json({ message: "Error saving photo to database" });
            });
        });
    });
  },

  getPhotos(req, res) {
    Photo.find({})
      .then((dbPhotoData) => {
        const photos = dbPhotoData.map((photo) => {
          const buffer = Buffer.from(photo.image, "base64");
          const base64Image = buffer.toString("base64");
          return {
            ...photo._doc,
            image: base64Image,
          };
        });
        res.json(photos);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
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
        const buffer = Buffer.from(dbPhotoData.image, "base64");
        const base64Image = buffer.toString("base64");
        const photoData = {
          ...dbPhotoData._doc,
          image: base64Image,
        };
        res.json(photoData);
      })
      .catch((err) => res.status(500).json(err));
  },

  deletePhoto({ params }, res) {
    Photo.findOneAndDelete({ _id: params.id })
      .then((dbPhotoData) => {
        if (!dbPhotoData) {
          res
            .status(404)
            .json({ message: "No photo data found with this id!" });
          return;
        }
        // Remove photo from user data
        return User.findOneAndUpdate(
          { photos: params.id },
          { $pull: { photos: params.id } },
          { new: true }
        );
      })
      .then(() => {
        // Fetch all photos to update the frontend
        return Photo.find({});
      })
      .then((updatedPhotos) => {
        res.json({
          message: "Photo successfully deleted!",
          photos: updatedPhotos,
        });
      })
      .catch((err) => res.status(500).json(err));
  },
};
