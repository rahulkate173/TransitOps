import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import config from "../config/config.js";

/**
 * verifyToken
 * Extracts and validates the JWT from the Authorization header.
 * On success: attaches full user document to req.user and calls next().
 * On failure: returns 401.
 */
export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token not found" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
