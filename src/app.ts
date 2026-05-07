import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

const app: Application = express();
app.use(cors());
app.use(cookieParser());

app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "HiredNow API is running successfully",
    timestamp: new Date().toISOString(),
  });
});

export default app;
