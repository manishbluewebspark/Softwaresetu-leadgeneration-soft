import { Router } from "express";
import upload from "../middleware/upload.js";
import { login, updateProfile } from "../controllers/authControllers.js";

const authrouter = Router();
authrouter.post("/login", login);
authrouter.put("/update-profile", upload.single("image"), updateProfile);

export default authrouter;
