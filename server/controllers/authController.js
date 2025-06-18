const jwt = require("jsonwebtoken");
exports.checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ loggedIn: true, userId: decoded.userId });
  } catch (error) {
    return res.status(403).json({ loggedIn: false });
  }
};
