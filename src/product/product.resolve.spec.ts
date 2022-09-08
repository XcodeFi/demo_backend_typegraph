import { GraphQLError } from 'graphql';
import { gCall } from "./../test/graphqlInit";
import { CreateProductInput } from "./dto/product/create-product.input";
import { clearDatabase, closeDatabase, connect } from "../test/db";
import { ArgumentValidationError } from "type-graphql";
import { ProductFilterInput } from './dto/product/product-filter.input';
import { ProductModel, Product } from './models/product.model';

import { ProductStatusType } from './enum/productStatusType';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("product resolve test for create product", () => {
  const mutation = `mutation Mutation($input: CreateProductInput!) {
    createProduct(input: $input) {
      name
      price
      categoryId
      description
      quantity
      imgUrls
      urlSlug
      likes
      rating
      status
      createdAt
    }
  }`;

  it("should throw ArgumentValidationError error", async () => {

    const productInput: CreateProductInput = {
      basePrice: 1.1,
      price: 1.1, // error
      name: "sp1", // error
      quantity: 1.1,
      description: "na",
      categoryId: 1.1,
      files: [] // error
    };

    const result = await gCall({
      source: mutation,
      variableValues: {
        input: productInput,
      },
    });

    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(1);

    const validationError = result.errors![0].originalError! as ArgumentValidationError;
    expect(validationError).toBeInstanceOf(ArgumentValidationError);
    expect(validationError.validationErrors).toHaveLength(7);
  });

  it("should throw schema error", async () => {

    const productInput = {
      basePrice: 1.1,
      price: 1.1, // error
      name: "sp1", // error
      description: '',
      files: [] // error
    };

    const result = await gCall({
      source: mutation,
      variableValues: {
        input: productInput,
      },
    });

    expect(result.data).toBeUndefined();
    expect(result.errors).toHaveLength(2);

    const validationError = result.errors![0] as GraphQLError;
    expect(validationError).toBeInstanceOf(GraphQLError);
    expect(validationError.message).toBeDefined();
  });
});

describe("product resolve test from get product",  () => {
  const query = `query GetProduct($urlSlug: String, $getProductId: ObjectId) {
    getProduct(urlSlug: $urlSlug, id: $getProductId) {
      name
      categoryId
      description
      quantity
      imgUrls
      urlSlug
      likes
      rating
      status
      price
    }
  }`

  it("should throw GraphQLError error", async () => {
    const request: ProductFilterInput = {
      urlSlug: '',
    }

    const result = await gCall({
      source: query,
      variableValues: {
        input: request,
      },
    });

    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(1);
  });


  it("should return 1 record", async () => {

    await mockData()
    const request: ProductFilterInput = {
      urlSlug: 'urlSlug',
    }

    const result = await gCall({
      source: query,
      variableValues: {
        urlSlug: request.urlSlug
      },
    });

    expect(result.data!.getProduct.urlSlug).toEqual('urlSlug');
    expect(result.errors).toBeUndefined();
  });
})

async function mockData() {
  const product = {
    name: 'name',
    description: 'desc',
    categoryId: 1,
    basePrice: 1,
    price: 1,
    quantity: 1,
    urlSlug: 'urlSlug',
    status: ProductStatusType.draft,
    createdAt: new Date(),
  } as Product;

  await ProductModel.create(product);
}