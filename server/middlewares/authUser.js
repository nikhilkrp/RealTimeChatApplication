import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const { token } = req.cookies;


    if (!token) {
        // console.log("No token found in cookies. Unauthorized access.");
        return res.json({ success: false, message: "Unauthorized access" });
    }

    try {
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", tokenDecode);
        req.userId = tokenDecode.id;
        console.log("User authenticated. User ID:", req.userId);
        next();

    } catch (error) {

        // console.log("JWT verification error:", error.message);
        return res.json({ success: false, message: error.message });
    }
}

export default authUser;