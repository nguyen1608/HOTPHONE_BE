import express from 'express';
import { uploadFile } from '../controllers/upload';

const routerUpload = express.Router();

routerUpload.post('/upload', uploadFile);

export default routerUpload;
