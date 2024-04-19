const router = require("express").Router();
const {
  createPhoto,
  getPhotoById,
  deletePhoto,
} = require("../../controllers/photo-controller");

// import middleware
const { authMiddleware } = require("../../utils/auth");

// on Insomnia:
// choose Auth bearer, add response-body attribute, and edit tag
// change request to the login api
// change filter to $. to find token
router.use(authMiddleware);

// /api/exercise/photo
router.route("/photo").post(createPhoto);

// /api/exercise/photo/:id
router.route("/photo/:id").get(getPhotoById).delete(deletePhoto);

module.exports = router;
