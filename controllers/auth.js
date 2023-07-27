import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
// import AWS from "aws-sdk";
import app from "../firebase/config";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";

// const SES = new AWS.SES(awsConfig);

// Get Firebase functions
//const FIREBASE = Firebase.functions();

const auth = getAuth();



export const register = async (req, res) => {
    try {
        //console.log(req.body);
        const {name, email, password} = req.body;

        //validation
        if(!name) return res.status(400).send("Name is required");
        if(!password || password.length < 6) {
            return res
            .status(400)
            .send("Password is required and should be min 6 characters long");
        }
        let userExist = await User.findOne({ email }).exec();
        if(userExist) return res.status(400).send("Email is taken");

        //hash password
        const hashedPassword = await hashPassword(password);

        //register
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await user.save();
        //console.log("save user", user);
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try Again.");
    }
 };



 export const login = async (req, res) => {
    try{
        //console.log(req.body);
        const { email, password } = req.body;
        //check if our db has user with that email
        const user = await User.findOne({ email }).exec();
        if(!user) return res.status(400).send("No user found");
        //check password
        /*const match = await comparePassword(password, user.password);
        if(!match) return res.status(400).send("wrong password");*/
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
                expiresIn: "7d",
        });
        // return user and token to client, exclude hashed password
        user.password = undefined;
        // sent token in cookie
        res.cookie("token", token, {
            httpOnly: true,
        // secure: true, //only works on https
        });
        // send user as json response
        //return res.status(400).send("Login Successful");
        // create signed jwt

    await signInWithEmailAndPassword(auth, email, password);
    res.json(user);
    }catch(error){

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        return res.status(400).send("Pawword not match."+errorMessage);
    }
 };

 export const logout = async (req, res) => {
    try{
        res.clearCookie("token");
        signOut(auth).then((data) => {
            return res.json({message: "Logout success."});
          }).catch((error) => {
            console.log(error);
          });
    }catch(err){
        console.log(err);
    }
 };

 export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password").exec();
        console.log("CURRENT_USER", user);
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
    }
 };


 export const forgotPassword = async(req, res) =>{
    try{
        const { email } = req.body;
        //console.log(email);
        //const shortCode = nanoid(6).toUpperCase();
        //const user = await User.findOneAndUpdate(
            //{ email }
        //);
        const user = await User.findOne({ email }).exec();
        if(!user) return res.status(400).send("User not found");

        //prepare for email
        /*const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                        <html>
                           <h1>Reset Password</h1>
                           <p>Use this code to reset your password</p>
                           <h2 style="color:red;">${shortCode}</h2>
                           <i>onlineeducation.com</i>
                        </html>
                        `,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Reset Password",
                },
            },
        };*/
        sendPasswordResetEmail(auth, email)
          .then((data) => {
            //console.log(data);
            res.json({ ok: true });
        })
        .catch((error) =>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            return res.status(400).send(errorMessage);
            //toast(errorMessage);
        });
    }catch(err){
        console.log(err);
        return res.status(400).send("Error. Try Again.");
    }
 };