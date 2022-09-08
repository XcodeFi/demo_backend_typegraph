import { Service } from "typedi";
import { UPLOAD_PATH } from "../environments";
import { createWriteStream, existsSync, mkdirSync, rmSync } from "fs";
import { basename, extname, join, resolve } from "path";
import { uuidv4 } from "../utils";
import { FileUpload } from "graphql-upload";

@Service()
export class FileUploadService {
  private readonly uploadPath: string;

  constructor() {
    this.uploadPath = UPLOAD_PATH;
  }

  private createUploadDirectoryIfNeeded() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveMutilFile(files: FileUpload[]): Promise<string[]> {
    return Promise.all(files.map(t => this.saveFile(t))).then(rs => {
      return rs;
    })
  }

  async saveFile(file: FileUpload): Promise<string> {
    const { createReadStream, filename } = await file;
    const ext = extname(filename);
    const name = basename(filename, ext);
    const newFileName = `${name}_${uuidv4()}${ext}`;
    const filePath = join(this.uploadPath, newFileName);
    this.createUploadDirectoryIfNeeded();
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on("finish", () => resolve(newFileName))
        .on("error", () => reject()),
    );
  }

  getFilePath(fileName: string): string {
    return resolve(join(this.uploadPath, fileName));
  }
  
  deleteFile(fileName: string) {
    rmSync(this.getFilePath(fileName));
  }
}
