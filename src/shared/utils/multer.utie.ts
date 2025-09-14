import { Request, Response, NextFunction, RequestHandler } from "express";
import multer, { FileFilterCallback } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { IMulter } from "../../domain/interface/util/multer.interface";

dotenv.config();

export interface FileUploadRequest extends Request {
  customFileNames?: string[];
}

export class FileUploadService implements IMulter{
  private storage: CloudinaryStorage;
  private allowedTypes: string[];
  private upload: RequestHandler;

  constructor(
    private _name: string,
    private _api_key: string,
    private a_pi_secret: string
  ) {
    cloudinary.config({
      cloud_name: this._name,
      api_key: this._api_key,
      api_secret: this.a_pi_secret,
    });

    this.allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "application/x-zip-compressed",
    ];

    this.storage = new CloudinaryStorage({
      cloudinary,
      params: async (req: FileUploadRequest, file: Express.Multer.File) => {
        const ext = path.extname(file.originalname);
        const baseName = `file_${Date.now()}_${Math.round(
          Math.random() * 1e6
        )}`;
        const fullFileName = `project-files/${baseName}${ext}`;

        if (!req.customFileNames) {
          req.customFileNames = [];
        }
        req.customFileNames.push(fullFileName);

        return {
          folder: "project-files",
          resource_type: "raw" as const,
          format: ext.slice(1),
          public_id: baseName,
          type: "authenticated",
        };
      },
    });

    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }).single("attachment");
  }

  private fileFilter: (
    req: FileUploadRequest,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => void = (req, file, cb) => {
    if (this.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX, and ZIP files are allowed"));
    }
  };

  public secureSingleUpload = (
    req: FileUploadRequest,
    res: Response,
    next: NextFunction
  ): void => {
    this.upload(req, res, (err?: unknown) => {
      if (req.file && req.customFileNames) {
        req.file.filename = req.customFileNames.slice(-1)[0];
      }

      if (err instanceof Error) {
        next(err);
      } else {
        next();
      }
    });
  };
}
