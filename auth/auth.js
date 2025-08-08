//require('dotenv').config()
const jwt = require('jsonwebtoken')

// School, Student, Teacher
const authMiddleware = (roles=[]) => {return(req, res, next) => {
   
    try {
        const token = req.header("Authorization")?.replace('Bearer ','');
        //const token = req.headers.authorization.split(' ')[1];
        // IN LOGIN FUNCTION :- res.header('Authorization', token)
        if (!token) {
        res.status(401).json({ success: false, message: 'No token, Authorization denied.'})
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            req.user = decoded; // Attach the decoded token to the request object

            // check if the user role is allowed to access the route
            if (roles.length > 0 && !roles.includes(req.user.role)){
               return res.status(403).json({ succes: false, message: 'Access Denied.'})
            }


            next(); //Call the next middleware or route handler
        }


    } catch (error) {
        
    }

}}



module.exports = authMiddleware;
