import "dotenv/config";
console.log("BACKEND STARTING - LOGGING ACTIVE");
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { HTTPSTATUS } from "./config/http.config";
import { Env } from "./config/env.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { connectDatabase } from "./config/database.config";
import { getAuth } from "./lib/auth";
import routes from "./routes"
import webhookRoutes from "./routes/webhook.route";



const app = express();

const allowedOriginPatterns = [
  Env.FRONTEND_ORIGIN,
  /\.vercel\.app$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, health checks)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOriginPatterns.some((pattern) =>
        typeof pattern === "string"
          ? pattern === origin
          : pattern.test(origin)
      );
      if (isAllowed) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.use("/api/webhook", webhookRoutes)

app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

const authRouter = express.Router();
authRouter.all("*", (req, res) => {
  const auth = getAuth();
  return toNodeHandler(auth)(req, res);
});
app.use("/api/auth", authRouter);

app.get("/health", asyncHandler(async (req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json({
    message: "Server is healthy",
    status: "Ok"
  })

}))

app.use("/api", routes)




app.use(errorHandler)

app.listen(Env.PORT, async () => {
  await connectDatabase()
  console.log(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
})
