import { GraphQLScalarType } from "graphql";
import { ClassType, Field, InputType } from "type-graphql";
import { FilterType } from "./../product/enum/productStatusType";

export const GenericScalarItem = <T>(
    classRef: ClassType<T> | GraphQLScalarType | String | Number | Boolean
) => {
    // `isAbstract` decorator option is mandatory to prevent registering in schema
    @InputType({ isAbstract: true })
    abstract class GenericType {
        @Field(() => classRef)
        data: T;
    }

    return GenericType;
};

export function GenericScalarArray<T>(
    classRef: ClassType<T> | GraphQLScalarType | String | Number | Boolean
) {
    // `isAbstract` decorator option is mandatory to prevent registering in schema
    @InputType({ isAbstract: true })
    abstract class GenericScalarArray {
        @Field(() => [classRef])
        data: T[];
    }

    return GenericScalarArray;
};

export function FilterField<TField>(TFieldClass: ClassType<TField> | GraphQLScalarType) {
    // `isAbstract` decorator option is mandatory to prevent registering in schema
    @InputType({ isAbstract: true })
    abstract class FilterFieldClass {
        // here we use the runtime argument
        @Field(() => TFieldClass)
        // and here the generic type
        val: TField | null = null;

        @Field(() => FilterType, {
            nullable: true,
            defaultValue: FilterType.EQUALS,
        })
        type?: FilterType = FilterType.EQUALS;
    }
    return FilterFieldClass;
}