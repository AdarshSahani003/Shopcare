import { Router } from "express";
import { registerUser, loginUser, logoutUser, listItem, buyItem, getAllListedItems, verificationId } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.post("/list", verifyJWT, upload.single("image"), listItem);

router.post("/buy", verifyJWT, buyItem);

router.route("/items").get(getAllListedItems)

router.route("/activate/:token").get(verificationId)

export default router