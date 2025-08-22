// import { expressjwt } from "express-jwt";
// import jwksRsa from "jwks-rsa";

// // Protect middleware - Auth0 JWT verify karega
// const protect = expressjwt({
//   secret: jwksRsa.expressJwtSecret({
//     jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//   }),
//   audience: process.env.AUTH0_AUDIENCE,
//   issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//   algorithms: ["RS256"],
//   requestProperty: 'auth',  // decoded token will be in req.auth
// });

// // isBuilder middleware - req.auth me role check karega
// const isBuilder = (req, res, next) => {
//   // Assuming user roles are inside the token under a custom claim, e.g.:
//   // "https://yourapp.com/roles": ["builder", "admin"]
  
//   const roles = req.auth['https://yourapp.com/roles'] || [];

//   console.log("User roles from token:", roles);

//   if (roles.includes("builder")) {
//     next();
//   } else {
//     return res.status(403).json({ message: "Only Builders Can Post Jobs" });
//   }
// };

// export { protect, isBuilder };


import dotenv from 'dotenv';
dotenv.config();

import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

// Environment variables check karo
console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);

// Protect middleware - Auth0 JWT verify karega
const protect = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  requestProperty: 'auth',  // decoded token will be in req.auth
});

// isBuilder middleware - req.auth me role check karega
const isBuilder = (req, res, next) => {
  // Assuming user roles are inside the token under a custom claim, e.g.:
  // "https://yourapp.com/roles": ["builder", "admin"]
  
  const roles = req.auth['https://yourapp.com/roles'] || [];

  console.log("User roles from token:", roles);

  if (roles.includes("builder")) {
    next();
  } else {
    return res.status(403).json({ message: "Only Builders Can Post Jobs" });
  }
};

export { protect, isBuilder };