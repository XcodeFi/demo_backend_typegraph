import { InputType, Int } from "type-graphql";
import { FilterField } from "./../../scalars/generic";

@InputType()
export class FilteredName extends FilterField(String) { }

@InputType()
export class FilteredAge extends FilterField(Int) { }