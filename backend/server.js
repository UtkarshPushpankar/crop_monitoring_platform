require("dotenv").config();
const express=require("express")
const app=express();
const cors = require('cors');
const mongoose = require("mongoose");
const PORT=process.env.PORT
const authRouter=require("./routes/auth")
const verifyUser=require("./middleware/authMiddleware.js")
require("./config/passport"); 

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Multiple origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use("/auth",authRouter);


app.post("/logout", (req, res) => {
  console.log("🔥 Logout route hit!");
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None" 
  });
  res.status(200).json({ message: "Logged out successfully" });
});

app.get("/verify-user", verifyUser, (req, res) => {
  console.log("Cookies:", req.cookies);
  res.json({ message: "User verified", name: req.user.name });
});



app.listen(PORT,()=>
    { console.log(`Server started on ${PORT}`)
})
// health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));