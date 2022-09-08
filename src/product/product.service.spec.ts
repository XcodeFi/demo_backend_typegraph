import mongoose from "mongoose";
import { User } from "src/user/models/users.model";
import { FileUploadService } from "../file/file.service";
import * as dbHandler from "../test/db";
import { CreateProductInput } from "./dto/product/create-product.input";
import { ProductModel } from "./models/product.model";
import { ProductsService } from "./product.service";

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("product service test", () => {
  const fileUploadService = new FileUploadService();
  const productService = new ProductsService(fileUploadService);

  const test_name = "new";

  it("can be created correctly", async () => {

    var id = new mongoose.Types.ObjectId("56cb91bdc3464f14678934ca");

    const user: User = {
        displayName: "",
        email: "",
        phoneNumber: "",
        password: "",
        _id: id
    };

    const productInput: CreateProductInput = {
      basePrice: 1,
      price: 0,
      name: test_name,
      quantity: 1,
      description: "description",
      categoryId: 1,
    };

    const productRs = await productService.create(productInput, user);

    // find inserted post by title
    const productInDb = await ProductModel.findOne(productRs._id).exec();
    // check that name is expected
    expect(productInDb?.name).toEqual(test_name);
  });
});
