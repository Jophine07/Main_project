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


  app.put("/update-query-reply/:queryId", async (req, res) => {
    const { queryId } = req.params;
    const { reply } = req.body;
  
    if (!queryId || !reply) {
      return res.status(400).json({ message: "Query ID and reply are required" });
    }
  
    try {
      const updatedQuery = await Query.findByIdAndUpdate(
        queryId,
        { reply },
        { new: true }
      );
  
      if (!updatedQuery) {
        return res.status(404).json({ message: "Query not found" });
      }
  
      res.status(200).json({ message: "Reply updated successfully", updatedQuery });
    } catch (error) {
      console.error("Error updating reply:", error);
      res.status(500).json({ message: "Error updating reply", error });
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
      const campaigns = await campaignModel.find({ status: "Active" }); // Only fetch active campaigns
      res.json(campaigns);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch campaigns." });
    }
});



app.post("/update-funds", async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Fetch the current campaign details
    const campaign = await campaignModel.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // Check if adding the amount exceeds the target
    const newTotalFunds = campaign.fundsRaised + amount;
    if (newTotalFunds > campaign.targetAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot donate. Target amount of ₹${campaign.targetAmount} has been reached.` 
      });
    }

    // Update fundsRaised in the Campaign model
    const updatedCampaign = await campaignModel.findByIdAndUpdate(
      campaignId,
      { $inc: { fundsRaised: amount } }, // Increment fundsRaised by the donated amount
      { new: true }
    );

    res.json({ success: true, message: "Funds updated successfully", updatedCampaign });
  } catch (error) {
    console.error("Update Funds Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.get("/get-user-replie", async (req, res) => {
  try {
    // Debugging: Log received query params
    console.log("Query params received:", req.query);

    // Extract userEmail from query parameters
    const userEmail = req.query.email;

    // Debugging: Log extracted email
    console.log("Extracted userEmail:", userEmail);

    if (!userEmail) {
      return res.status(400).json({ message: "Bad Request: Email parameter is missing" });
    }

    // Fetch queries where the logged-in user has replied
    const userReplies = await Query.find({
      "reply.investorEmail": userEmail, // Find replies by the logged-in user
    });

    if (userReplies.length === 0) {
      console.log("No replies found for:", userEmail);
      return res.status(404).json({ message: "No replies found." });
    }

    console.log("User Replies Retrieved:", userReplies);
    res.status(200).json(userReplies);
  } catch (error) {
    console.error("Error fetching user replies:", error);
    res.status(500).json({ message: "Error fetching replies", error });
  }
});
app.get("/get-user-replies/:userEmail", async (req, res) => {
  try {
    const investorEmail = req.params.userEmail;
    
    // Fetch queries from MongoDB
    const queries = await Query.find({ investorEmail });

   

    // Return queries
    res.json(queries);
  } catch (error) {
    console.error("❌ Error fetching queries:", error.message);
    res.status(500).json({ error: "Error fetching queries" });
  }
});





//------------------Admin Dashboard------------------



app.get("/adminallcampaigns", async (req, res) => {
  try {
    const campaigns = await campaignModel.find(); // Fetch all campaigns, regardless of status
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campaigns." });
  }
});




app.put("/update-campaign-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await campaignModel.findByIdAndUpdate(id, { status });
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});


app.delete("/delete-campaign/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await campaignModel.findByIdAndDelete(id);
    
    if (!deletedCampaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/search-campaigns", async (req, res) => {
  try {
    const { email } = req.query;
    const campaigns = await Campaign.find({ email: { $regex: email, $options: "i" } }); // Case-insensitive search
    res.json(campaigns);
  } catch (err) {
    console.error("Error searching campaigns:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/allusers", async (req, res) => {
  try {
    const users = await signupModel.find({ userType: "user" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


app.get("/api/allinvestors", async (req, res) => {
  try {
    const investors = await signupModel.find({ userType: "investor" });
    res.json(investors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch investors" });
  }
});


app.delete("/api/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await signupModel.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user/investor" });
  }
});


app.get("/all-queries", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.delete("/delete-query/:id", async (req, res) => {
  try {
    const deletedQuery = await Query.findByIdAndDelete(req.params.id);
    if (!deletedQuery) return res.status(404).json({ error: "Query not found" });

    res.json({ message: "Query deleted successfully!" });
  } catch (error) {
    console.error("Delete Query Error:", error);
    res.status(500).json({ error: "Failed to delete query" });
  }
});



app.get("/search-queries", async (req, res) => {
  try {
    const searchTerm = req.query.term ? req.query.term.toLowerCase() : "";

    const queries = await Query.find({
      $or: [
        { investorEmail: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search
        { userEmail: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.json(queries);
  } catch (error) {
    console.error("Search Queries Error:", error);
    res.status(500).json({ error: "Failed to search queries" });
  }
});





app.listen(8080,()=>{
  console.log("Server Turned On")
})