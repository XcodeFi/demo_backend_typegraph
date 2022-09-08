import { ArrayMaxSize, ArrayMinSize, IsInt, IsNotEmpty, IsString, Length, Min} from "class-validator";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";

// https://github.com/typestack/class-validator
@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @Length(5, 120, {
    message: 'Tên sản phẩm phải từ 5 đến 120 ký tự!',
  })
  name: String;

  @Field()
  @Length(5, 3000, {
    message: 'Mô tả sản phẩm phải từ 5 đến 3000 ký tự!',
  })
  description: String;

  @Field()
  @IsInt()
  @Min(1,{
    message:'Giá bán phải lớn hơn 1'
  })
  price?: number;

  @Field()
  @IsNotEmpty() 
  @IsInt()
  basePrice?: number;

  // @Field()
  // sku: String;e

  @Field(() => [GraphQLUpload])
  @ArrayMinSize(1, {
    message: 'Sản phẩm phải có ít nhất một ảnh mô tả'
  })
  @ArrayMaxSize(8)
  readonly files?: FileUpload[];

  @Field()
  @IsNotEmpty()
  @IsInt()
  quantity?: number;

  @Field(() => Number)
  @IsNotEmpty({
    message:'Loại sản phẩm không được để trống'
  })
  @IsInt()
  categoryId?: number;
}
