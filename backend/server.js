import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import authRoutes from "./Routes/Auth.js";
import userRoutes from "./Routes/User.js";
import jobRoutes from "./Routes/Jobs.js";
import taskerRoutes from "./Routes/Tasker.js";
import reviewRoutes from "./Routes/Reviews.js";
import adminRoutes from "./Routes/Admin.js";
import messageRoutes from "./Routes/Messages.js";
import notificationRoutes from "./Routes/Notifications.js";
import supportRoutes from "./Routes/Support.js";
import walletRoutes from "./Routes/Wallet.js";
import Admin from "./Models/Admin.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    const adminExists = await Admin.findOne({ email: 'admin@smartrorozgar.com' });
    if (!adminExists) {
      const hashed = await bcrypt.hash('admin123', 12);
      await Admin.create({
        fullName: 'SmartRozgar Admin',
        email: 'admin@smartrorozgar.com',
        password: hashed,
        role: 'admin',
      });
      console.log('Default admin created: admin@smartrorozgar.com / admin123');
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/taskers", taskerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.send("SmartRozgar API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
