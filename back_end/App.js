const express = require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const router=express.Router()
const bcrypt=require("bcryptjs")
const jwt =require('jsonwebtoken')
const { signupModel } = require("./Models/SignUp")
const { adminModel } = require("./Models/Admin")


const app=express()
app.use(cors())
app.use(express.json())

const generateHashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

mongoose.connect("mongodb+srv://jophine:jophinepaul@cluster0.oyyvgui.mongodb.net/MainDB?retryWrites=true&w=majority&appName=Cluster0")


app.post("/SignUp",async(req,res)=>
    {
        let input=req.body
        let hashedpassword=await generateHashPassword(input.password)
        console.log(hashedpassword)
        input.password=hashedpassword
        let signup=new signupModel(input)
        signup.save()
        res.json({"status":"Saved"})
    })

    app.post("/Login", async (req, res) => {
        try {
            const { email, password, userType } = req.body;
    
           
            const user = await signupModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ status: "Not Found" });
            }
    
            
            if (user.userType !== userType) {
                return res.status(403).json({ status: "User Type Mismatch" });
            }
    
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ status: "Incorrect Password" });
            }
    
            res.status(200).json({ status: "Login Success", userType: user.userType });
    
        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ status: "Internal Server Error" });
        }
    });    

    app.post("/adminSignUp",async(req,res)=>
        {
            let input=req.body
            let hashedpassword=await generateHashPassword(input.admin_password)
            console.log(hashedpassword)
            input.admin_password=hashedpassword
            let admin=new adminModel(input)
            admin.save()
            res.json({"Status":"Saved"})
        })
        


app.post("/adminLogin", async (req, res) => {
    try {
        const { admin_name, admin_password } = req.body;

        // Find admin by name
        const admin = await adminModel.findOne({ admin_name });

        if (!admin) {
            return res.status(404).json({ status: "User Not Found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(admin_password, admin.admin_password);

        if (isMatch) {
            return res.status(200).json({ status: "Login Success" });
        } else {
            return res.status(401).json({ status: "Incorrect Password" });
        }
    } catch (error) {
        console.error("Admin Login Error:", error);
        return res.status(500).json({ status: "Internal Server Error" });
    }
});





app.listen(8080,()=>{
    console.log("Server Turned On")
})


