import { Router } from "express"

export interface IAdminRoute{
    getRouter(): Router
}