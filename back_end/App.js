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
const multer = require("multer");
const Milestone = require("./Models/MileStone")
const path = require("path"); 
const fs = require("fs");
const nodemailer = require("nodemailer");





const app=express()
app.use(cors())
app.use(express.json())


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const generateHashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}


const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


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
  



  app.get('/campaign/:campaignId', async (req, res) => {
    try {
        const campaign = await campaignModel.findById(req.params.campaignId);
        if (!campaign) return res.status(404).json({ error: "Campaign not found" });
        res.json(campaign);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});




// API to Upload Proof File
app.post("/upload-proof", upload.single("proofFile"), async (req, res) => {
  try {
    const { campaignId, milestoneNo } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find the milestone and update
    const milestone = await Milestone.findOneAndUpdate(
      { campaignId, milestoneNo },
      {
        proofFile: req.file.path, // Save file path in DB
        status: "Pending",
        submittedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Proof uploaded successfully", milestone });
  } catch (error) {
    res.status(500).json({ message: "Error uploading proof", error });
  }
});




app.get("/:campaignId/milestones", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const milestones = await Milestone.find({ campaignId }).sort("milestoneNo");

    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/upload-proof", upload.single("proofFile"), async (req, res) => {
  try {
    const { campaignId, milestoneNo, gitLink, campaignTitle } = req.body;
    const proofFile = req.file ? req.file.path : null;


    if (!campaignId || !milestoneNo || !proofFile) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      console.log("❌ Campaign not found");
      return res.status(404).json({ error: "Campaign not found" });
    }

    let milestoneFound = false;

    console.log("🔎 Existing Milestones Before Update:", campaign.milestones);

    // Update the correct milestone
    campaign.milestones = campaign.milestones.map((milestone) => {
      if (milestone.no === parseInt(milestoneNo)) {
        milestoneFound = true;
        console.log(`✅ Updating Milestone ${milestoneNo}`);
        return {
          ...milestone,
          proofFile,
          gitLink: gitLink || milestone.gitLink, // Keep old gitLink if new is empty
          status: "Pending",
          campaignTitle,
        };
      }
      return milestone;
    });

    if (!milestoneFound) {
      console.log("❌ Milestone not found in campaign");
      return res.status(404).json({ error: "Milestone not found in campaign" });
    }

    // Save the updated campaign
    await campaign.save();

    // Fetch updated campaign data
    const updatedCampaign = await Campaign.findById(campaignId);

    console.log("🔄 Updated Campaign Milestones:", updatedCampaign.milestones);

    res.json({ message: "Proof uploaded successfully", campaign: updatedCampaign });
  } catch (error) {
    console.error("❌ Error uploading proof:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/submit-gitlink", async (req, res) => {
  try {
    const { campaignId, milestoneNo, gitLink } = req.body;

    console.log("📥 Received Data:", { campaignId, milestoneNo, gitLink });

    if (!campaignId || !milestoneNo || !gitLink) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find and update the milestone
    const updatedMilestone = await Milestone.findOneAndUpdate(
      { campaignId, milestoneNo },
      { gitLink }, // Update GitHub link only
      { new: true }
    );

    if (!updatedMilestone) {
      console.log("❌ Milestone not found");
      return res.status(404).json({ error: "Milestone not found" });
    }


    res.json({ message: "GitHub link updated successfully", milestone: updatedMilestone });
  } catch (error) {
    console.error("❌ Error updating GitHub link:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/addcampaign", async (req, res) => {
  try {
    const { email, title, description, targetAmount, deadline, category, location, fundingType } = req.body;

    console.log("📌 Received request to create campaign:", req.body); // Debugging

    // Create new campaign
    const newCampaign = new campaignModel({
      email,
      title,
      description,
      targetAmount,
      deadline,
      category,
      location,
      fundingType,
    });

    const savedCampaign = await newCampaign.save();
    console.log("✅ Campaign Created:", savedCampaign); // Debugging

    if (!savedCampaign._id) {
      console.error("❌ Error: Campaign ID is undefined!");
      return res.status(500).json({ success: false, message: "Campaign ID is missing!" });
    }

    // ✅ Automatically create 5 milestones for this campaign
    const milestones = [];
    for (let i = 1; i <= 6; i++) {
      milestones.push({
        campaignId: savedCampaign._id, // Link milestone to campaign
        milestoneNo: i,
        title: `Milestone ${i}`, // Default title (optional)
        status: "Pending",
      });
    }

    console.log("🛠 Creating Milestones:", milestones); // Debugging

    // Insert milestones into the database
    const insertedMilestones = await Milestone.insertMany(milestones);
    console.log("✅ Milestones Created:", insertedMilestones); // Debugging

    res.status(201).json({ success: true, message: "Campaign & milestones created successfully!" });
  } catch (error) {
    console.error("❌ Error in campaign creation:", error);
    res.status(500).json({ success: false, message: "Internal server error!" });
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



app.get("/Tracker/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const milestones = await Milestone.find({ campaignId }).sort("milestoneNo");

    if (!milestones.length) {
      return res.status(404).json({ message: "No milestones found for this campaign" });
    }

    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ message: "Failed to retrieve milestones" });
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

    // Fetch the campaign from the database
    const campaign = await campaignModel.findById(id);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    console.log("✅ Campaign found:", campaign); // Log the campaign object

    // Update status
    campaign.status = status;
    await campaign.save();

    res.json({ message: "Status updated successfully" });

    // ✅ Debugging: Log email and status before sending email
    console.log("✅ Email field:", campaign.email);
    console.log("✅ Status received:", status);

    // ✅ Check if email exists and status is "Approved"
    if (campaign.email && (status === "Approved" || status === "Active")) {  // Allow both
      console.log("✅ Sending email to:", campaign.email);
    
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "jophinemca007@gmail.com",
          pass: "eiehwgcpfitrjlas",
        },
      });
    
      const mailOptions = {
        from: "jophinemca007@gmail.com",
        to: campaign.email,
        subject: "Campaign Status Updated",
        html: `<h2>Your campaign status has been updated to: ${status}</h2>`,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Error sending mail:", error);
        } else {
          console.log("✅ Mail sent successfully:", info.response);
        }
      });
    } else {
      console.log("❌ No email found or status is not 'Approved' or 'Active'.");
    }
    
  } catch (error) {
    console.error("❌ Error updating status:", error);
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



app.get("/admin/campaign/:campaignId", (req, res) => {
  const campaignId = req.params.campaignId;
  
  if (!campaignModel[campaignId]) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  // Only return milestone-related details for the admin
  const campaignData = {
    title: campaignModel[campaignId].title,
    targetAmount: campaignModel[campaignId].targetAmount,
    milestonesStatus: campaignModel[campaignId].milestonesStatus || {},
  };

  res.json(campaignData);
});

app.get("/milestones/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    if (!campaignId) {
      return res.status(400).json({ message: "Campaign ID is required." });
    }

    const milestones = await Milestone.find({ campaignId });

    if (!milestones.length) {
      return res.status(404).json({ message: "No milestones found for this campaign." });
    }

    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


app.put("/milestones/update-status/:milestoneId", async (req, res) => {
  const { milestoneId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["Pending", "Verifying", "Approved"];

  console.log("🔹 Received status in request:", status); // Debugging

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedMilestone = await Milestone.findByIdAndUpdate(
      milestoneId,
      {
        $set: {
          status: status,
          approvedAt: status === "Approved" ? new Date() : null,
        },
      },
      { new: true, runValidators: true }
    ).populate("campaignId");

    console.log("🔹 Updated Milestone:", updatedMilestone); // Debugging

    if (!updatedMilestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    const campaignEmail = updatedMilestone.campaignId?.email;
    console.log("🔹 Campaign Email Found:", campaignEmail); // Debugging

    if (!campaignEmail) {
      return res.status(404).json({ message: "Campaign email not found" });
    }

    res.json({
      message: "Milestone status updated successfully",
      milestone: updatedMilestone,
    });

    // ✅ Send email on any status change
    console.log("✅ Sending email to:", campaignEmail);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "jophinemca007@gmail.com",
        pass: "eiehwgcpfitrjlas",
      },
    });

    const mailOptions = {
      from: "jophinemca007@gmail.com",
      to: campaignEmail,
      subject: `Milestone Status Updated to ${status}`,
      html: `<h2>Your milestone "${updatedMilestone.title}" status has been updated!</h2>
             <p>The new status is: <strong>${status}</strong>.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending mail:", error);
      } else {
        console.log("✅ Mail sent successfully:", info.response);
      }
    });

  } catch (error) {
    console.error("❌ Error updating milestone status:", error);
    res.status(500).json({ message: "Error updating milestone status", error });
  }
});


app.post("/milestones/create", async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({ error: "Campaign ID is required" });
    }

    // Find existing milestones for the campaign to determine milestone number
    const count = await Milestone.countDocuments({ campaignId });

    const newMilestone = new Milestone({
      campaignId,
      milestoneNo: count + 1, // Increment milestone number
      title: `Milestone ${count + 1}`,
      status: "Pending",
      submittedAt: new Date(),
    });

    await newMilestone.save();
    res.status(201).json({ message: "Milestone created successfully", milestone: newMilestone });

  } catch (error) {
    console.error("Error creating milestone:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





app.listen(8080,()=>{
  console.log("Server Turned On")
})