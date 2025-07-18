const jwt = require("jsonwebtoken");

//middleware to validate token
const verifyToken = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      // Get the JWT token from the Authorization in postman(bearer token) and split
      let jwtToken = req.headers.authorization.split("Bearer ")[1];
      let decodedJwt = await new Promise((resolve, reject) => {
        try {
          // Verifies the JWT token and stores in a variable
          const decodedJwt = jwt.verify(
            jwtToken,
            process.env.ACCESS_TOKEN_SECRET || "taskmanagementjwttokensecret"
          );
          resolve(decodedJwt);
        } catch (error) {
          reject(error);
        }
      });

      // decoded variable contains the payload of the token
      let userId = decodedJwt.id;
      console.log(userId);
      req.userId = userId;

      // Calls the next function
      next();
    } else {
      res.status(401).send("Authentication failed");
      console.log("no token-Authentication failed");
    }
  } catch (error) {
    console.log(`${error.message} -Authentication failed`);
    return res.status(401).send("Authentication failed");
  }
};

module.exports = verifyToken;
