import { Router } from "express"

export interface IUserRoute{
  getRouter(): Router
}