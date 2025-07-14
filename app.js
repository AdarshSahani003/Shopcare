import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
const allowedOrigins = ["http://localhost:5173", "*"];
if (process.env.CLIENT_ORIGIN) {
  allowedOrigins.push(process.env.CLIENT_ORIGIN);
}

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

app.use(cors({
  origin: true, // Reflect request origin automatically
  credentials: true
}));

// Middleware
app.use(express.json({ limit: "5MB" }));
app.use(express.urlencoded({ extended: true, limit: "5MB" }));
app.use(cookieParser());

// ✅ Serve static files correctly
app.use(express.static(path.join(__dirname, "public")));

// API routes
import userRouter from "./src/routes/user.routes.js";
app.use("/api/v1/users", userRouter);

// ✅ Fallback for React SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export { app };
