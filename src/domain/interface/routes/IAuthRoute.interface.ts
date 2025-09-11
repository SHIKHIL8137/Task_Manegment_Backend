import { Router } from "express"

export interface IAuthRoute{
  getRouter(): Router
}