import { Router } from "express";
import { registerUser, loginUser, logoutUser, listItem, buyItem, getAllListedItems, verificationId, getUserItems } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.post('/sell', upload.fields([{ name: 'itemImageUrl', maxCount: 5 }]),verifyJWT, listItem);

router.post("/buy", verifyJWT, buyItem);

router.route("/items").get(getAllListedItems)

router.route("/activate/:token").get(verificationId)

router.route("/listUserItems").get(verifyJWT, getUserItems)

router.route("/verify").get(verifyJWT, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    },
  });
});


export default router