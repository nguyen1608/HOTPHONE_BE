import express from "express";
import cors from "cors";
import connectMongoDB from "./config/dbconfig";
import router from "./routes";
import { config } from 'dotenv';
import routerUpload from "./routes/upload";

config();
const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' })); // Tăng giới hạn cho JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Tăng giới hạn cho URL-encoded

app.use('/uploads', express.static('uploads'));
app.use('/api', routerUpload);

const dbUrl = process.env.DB_URI || "mongodb://127.0.0.1:27017/db_fw2";
connectMongoDB(dbUrl);

app.use("/", router);

export const viteNodeApp = app;
