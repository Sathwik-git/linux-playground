import express from "express";
import * as dotenv from "dotenv";
import cors from "cors"
import { launchInstance, terminateInstanceByIp } from "./aws";
import { connectDB, UserModel } from "./db";
import authRouter from "./auth";
import { authMiddleware } from "./middleware";
dotenv.config();
const app = express();
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRouter);
app.use(authMiddleware);
app.get("/launchInstance", async (req, res): Promise<any> => {
  try {
    const instance = await launchInstance();
    if (!instance) {
      return res.status(500).json({ error: "Failed to launch instance" });
    }
    res.json({ InstanceIP: instance.publicIp });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

app.delete("/deleteInstance", async (req, res): Promise<any> => {
  try {
    const { publicIp } = req.body;
    await terminateInstanceByIp(publicIp);
    res.json({ msg: "succesfully terminated" });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error while launching instance",
    });
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log(`app listening on port ${PORT}`);
});
