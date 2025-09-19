import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {

    //checks if the request has a logged user 
    if (!req.auth.userId) {
       return res.status(401).json({ message: "Unauthorized - you must be logged in"});
         
    }
   
    next();
};

// function to check is user is admin 
export const requireAdmin = async (req, res, next) => {
    try{
        const currentUser = await clerkClient.users.getUser(req.auth().userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
        if (!isAdmin) {
           return res.status(403).json({ message: "Unauthorized - you must be admin" });
        }
          // ✅ attach the user object so later routes/controllers can use it
        req.user = currentUser;
        next();
    }   catch (error){
        next(error); 
    }
};

