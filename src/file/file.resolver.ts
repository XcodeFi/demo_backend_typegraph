// import { uuidv4 } from "./utils";

// import { File } from "./models/file.model";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import FileSchema from "./schemas/file.schema";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { uuidv4 } from "../utils";

@Resolver(() => FileSchema)
@Service()
export class FileResolver {
  // @Query()
  // async files(): Promise<File[]> {
  // 	return getMongoRepository(File).find({
  // 		cache: true
  // 	})
  // }

  // @Mutation()
  // async uploadFile(@Arg('file') file: any): Promise<File> {
  // 	const { filename } = file

  // 	console.log(file)

  // 	// const path = await uploadFile(file)

  // 	// const newFile = await getMongoRepository(File).save(
  // 	// 	new File({ filename, path })
  // 	// )

  // 	return newFile
  // }

  @Mutation(() => String)
  async uploadFileLocal(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Ctx() { req }: any
  ): Promise<String> {
    return this._uploadFile(file, req);
  }

  @Mutation(() => [String])
  async uploadMultiFileLocal(
    @Arg("files", () => [GraphQLUpload]) files: FileUpload[],
    @Ctx() { req }: any
  ): Promise<String[]> {
    return Promise.all(files.map(t => this._uploadFile(t,req))).then(rs => {
      return rs;
    })
  }

  private async _uploadFile(
    file: FileUpload,
    req: any
  ): Promise<String> {

    const { filename, createReadStream, mimetype } = await file
    const convertFilename = `${uuidv4()}.${mimetype.split('/')[1]}`

    createWriteStream(`./static/${convertFilename}`)
    const writableStream = createWriteStream(
      `./static/${convertFilename}`,
      { autoClose: true }
    );

    console.log(filename);

    return new Promise((resolve, reject) => {
      createReadStream()
        .pipe(writableStream)
        .on('finish', async () => {
          const link = `${req.headers.host}/static/${convertFilename}`
          resolve(link)
        })
        .on('error', err => {
          console.log('Error upload ', err)

          reject(err)
        })
    });
  }
}
