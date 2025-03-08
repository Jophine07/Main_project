const express = require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const router=express.Router()
const bcrypt=require("bcryptjs")
const jwt =require('jsonwebtoken')
const { signupModel } = require("./Models/SignUp")
const { adminModel } = require("./Models/Admin")
const { campaignModel } = require("./Models/Campaign")
const Query = require("./Models/Query")





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



//---------------USER DASHBOARD---------------






app.post("/addcampaign", async (req, res) => {
  try {
    // Check if email is missing
    if (!req.body.email) {
      return res.status(400).json({ success: false, message: "❌ Email is required!" });
    }

    const newCampaign = new campaignModel(req.body);
    await newCampaign.save();

    res.json({ success: true, message: "✅ Campaign Created Successfully!" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "❌ Server Error!", error });
  }
});






app.get("/yourcampaigns", async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const campaigns = await campaignModel.find({ email });

        if (campaigns.length === 0) {
            console.log("No campaigns found for this email.");
        }

        res.json(campaigns);
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


app.get("/get-queries/:userEmail", async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
      
      // Fetch queries from MongoDB
      const queries = await Query.find({ userEmail });
  
     
  
      // Return queries
      res.json(queries);
    } catch (error) {
      console.error("❌ Error fetching queries:", error.message);
      res.status(500).json({ error: "Error fetching queries" });
    }
  });


  app.post("/reply-query/:investorEmail", async (req, res) => {
    try {
      const investorEmail = req.params.investorEmail;
      const { userEmail, reply } = req.body; // User responding
  
  
      if (!investorEmail || !userEmail || !reply) {
        return res.status(400).json({ error: "Missing required fields!" });
      }
  
      // Update all queries where userEmail and investorEmail match
      const updatedQuery = await Query.updateMany(
        { investorEmail, userEmail }, // Match both investor and user
        { $set: { reply } } // Set reply
      );
  
      console.log("✅ Updated queries:", updatedQuery);
  
      res.json({ message: "Reply submitted successfully!" });
    } catch (error) {
      console.error("❌ Error submitting reply:", error);
      res.status(500).json({ error: "Error submitting reply" });
    }
  });


//------------------Investor Dashboard------------------



app.post("/submit-query", async (req, res) => {
    try {
      const { investorEmail, userEmail, message } = req.body;
      const newQuery = new Query({ investorEmail, userEmail, message });
      await newQuery.save();
      res.status(201).json({ message: "Query submitted successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error submitting query" });
    }
  });
  

  app.get("/allcampaigns", async (req, res) => {
    try {
      const campaigns = await campaignModel.find();
      res.json(campaigns);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch campaigns." });
    }
  });



app.listen(8080,()=>{
    console.log("Server Turned On")
})


//------------------Admin Dashboard------------------


app.put("/update-campaign/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await campaignModel.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({ message: "Campaign updated successfully", campaign });
  } catch (error) {
    res.status(500).json({ message: "Error updating campaign", error });
  }
});
