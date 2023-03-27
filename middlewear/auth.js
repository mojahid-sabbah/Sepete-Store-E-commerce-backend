 import { userModel } from '../DB/models/user.model.js';
import jwt from 'jsonwebtoken';        // npm i jsonwebtoken 

 




 
 
export const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const { token } = req.headers; 
      
      if (!token || !token.startsWith(process.env.bearerToken)) {
        return res.status(401).json({ message: "Invalid token or bearer Token" });
      } 
      const mytoken = token.split(process.env.bearerToken)[1];
      const decoded = jwt.verify(mytoken, process.env.LOGIN_TOKEN_SECRET);
       if (!decoded.id) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      const user = await userModel.findById(decoded.id); // .select("_id role")
     
      if (user.blocked) {
        return res.status(401).json({ message: "blocked User" });
      }
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (roles.length && !roles.includes(user.role)) {   //auth(['admin']) router
        return res.status(403).json({ message: "Forbidden not autharize account" });
      } 

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "catch auth  error" });
    }
  };
};


 