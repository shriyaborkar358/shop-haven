import jwt from "jsonwebtoken";

// Check Authentication
const jwtVerifyMiddleware = async (req, res, next) => {
  const jwtToken = req.headers?.authorization?.split(" ")[1];

  if (!jwtToken) {
    return res.status(401).json({
      success: false,
      message: "JWT Token missing",
    });
  }

  try {
    const decoded = await jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid JWT token",
    });
  }
};

// Check Authorization
const checkRoleMiddleware = async (req, res, next) => {
  const userRole = req?.user?.role;
  const method = req.method;
  const path = req.path;
  if (method === "POST" && path === "/products" && userRole !== "admin"){
    return res.status(403).json({
      message: "You don't have permission to perform this action"
    })
  }
  next()
};


export { jwtVerifyMiddleware, checkRoleMiddleware };
