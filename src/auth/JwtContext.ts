import { Request, Response } from "express";
import { JWTPayload } from "./jwt-payload.interface";

export interface JwtConfext {
  req: Request;
  res: Response;
  payload?: JWTPayload;
}