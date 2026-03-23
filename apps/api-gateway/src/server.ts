import express from "express";
import jwt from "jsonwebtoken";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

//app.use(express.json());

const JWT_SECRET = "supersecret";

// Authentication Middelware

const authenticate = (req: any, res: any, next: any) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: "No token provided"});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch {
        return res.status(401).json({error: "Invalid token"});
    }
};

// Public route (login simulation)
app.post("/auth/login", express.json(), (req, res) => {
    const {username} = req.body;

    const token = jwt.sign({username}, JWT_SECRET, { expiresIn: "1h"});

    res.json({token})
});

app.use(
    "/events",
    authenticate,
    createProxyMiddleware({
        target: "http://localhost:3000/events",
        changeOrigin: true,
        ignorePath: false,
    })
);

app.listen(4000, () => {
    console.log("API Gateway running on port 4000");
});