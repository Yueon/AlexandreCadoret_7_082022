// pour créer le routeur on a besoin d'express
const express = require("express");
// on créer un routeur avec la méthode Router() d'express
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
// appel de rate limiter
// limiter le nombre de requête que peut faire un client
const raterLimit = require("express-rate-limit");
// définition de la limitation de requete
const limiter = raterLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // 50 essais
});
// on importe la logique des routes
const userController = require('../controllers/user.controllers');



// ROUTES USER
router.post("/signup", userController.signup);
router.post("/login", limiter, userController.login);
router.get("/logout", userController.logout)
router.get('/', auth, userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put("/:id", userController.updateUser);
//router.post("/upload", upload.single("file"), userController.uploadProfil);
router.delete("/:id", auth, userController.deleteUser);

// on exporte router
module.exports = router;