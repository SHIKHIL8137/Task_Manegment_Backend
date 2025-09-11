import {Router} from 'express'
import { AuthRoute } from './routers/auth.router';

import { HttpStatus } from '../../shared/constents/httpStatus';
import { UserRoute } from './routers/user.router';
import { AdminRoute } from './routers/admin.router';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { AdminController } from '../controllers/admin.controller';
import { Messages } from '../../shared/constents/message';
import { UserUsecase } from '../../application/usecase/user.usecase';
import { UserRepository } from '../../infrastructure/database/Repository/user.repo';
import UserModel from '../../infrastructure/database/models/user.database';
import { OTPRepository } from '../../infrastructure/database/Repository/otp.repo';
import OtpModel from '../../infrastructure/database/models/otp.database';
import { Mailer } from '../../shared/utils/mailer.utiles';
import { configEnv } from '../../infrastructure/config/env.config';
import { GenerateData } from '../../shared/utils/generateData.urils';
import { OtpUsecase } from '../../application/usecase/otp.usecase';
import { TokenService } from '../../shared/utils/jwt.util';
import { Authentication } from '../middlewares/jwtAuth.middleware';

const route = Router();
const mailer = new Mailer(configEnv.email,configEnv.password)
const generateData = new GenerateData();
const jwtService = new TokenService(configEnv.accessSecret,configEnv.refreshSecret)
const userRepository = new UserRepository(UserModel)
const otpRepository = new OTPRepository(OtpModel)
const otpUsecase = new OtpUsecase(otpRepository,userRepository,HttpStatus,Messages,generateData,mailer)
const userUsecase = new UserUsecase(userRepository,otpRepository,HttpStatus,Messages,generateData,jwtService)
const authController = new AuthController(HttpStatus,Messages,userUsecase,otpUsecase,configEnv);
const userController = new UserController(HttpStatus,Messages,userUsecase);
const adminController = new AdminController(HttpStatus)
const authentication = new Authentication(HttpStatus,Messages,jwtService)
const authRoute = new AuthRoute(authController,authentication)
const userRoute = new UserRoute(userController);
const adminRoute = new AdminRoute(adminController);

route.use('/auth',authRoute.getRouter())
route.use('/user',userRoute.getRouter())
route.use('/admin',adminRoute.getRouter())


export default route