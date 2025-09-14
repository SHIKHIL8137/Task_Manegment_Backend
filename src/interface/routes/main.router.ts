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
import { TaskUSecase } from '../../application/usecase/task.usecase';
import { TaskRepository } from '../../infrastructure/database/Repository/task.repo';
import TaskModel from '../../infrastructure/database/models/task.database';
import { CronJob } from '../../shared/utils/cronJob.utils';
import { SubmissionRepository } from '../../infrastructure/database/Repository/submission.repo';
import SubmissionModel from '../../infrastructure/database/models/submission.database';
import { FileUploadService } from '../../shared/utils/multer.utie';

const route = Router();
const mailer = new Mailer(configEnv.email,configEnv.password)
const generateData = new GenerateData();
const jwtService = new TokenService(configEnv.accessSecret,configEnv.refreshSecret)
const userRepository = new UserRepository(UserModel)
const otpRepository = new OTPRepository(OtpModel)
const taskRepository = new TaskRepository(TaskModel)
const taskUsecase = new TaskUSecase(taskRepository,generateData,HttpStatus,Messages)
const otpUsecase = new OtpUsecase(otpRepository,userRepository,HttpStatus,Messages,generateData,mailer)
const submissionRepository = new SubmissionRepository(SubmissionModel) 
const userUsecase = new UserUsecase(userRepository,otpRepository,HttpStatus,Messages,generateData,jwtService,submissionRepository)
const authController = new AuthController(HttpStatus,Messages,userUsecase,otpUsecase,configEnv);
const userController = new UserController(HttpStatus,Messages,userUsecase);
const adminController = new AdminController(HttpStatus,Messages,taskUsecase)
const authentication = new Authentication(HttpStatus,Messages,jwtService)
const uploadService = new FileUploadService(configEnv.cloudinary_cloud_name,configEnv.cloudinary_api_key,configEnv.cloudinary_api_secret)
const authRoute = new AuthRoute(authController,authentication)
const userRoute = new UserRoute(userController,uploadService);
const authService = new Authentication(HttpStatus,Messages,jwtService)
const adminRoute = new AdminRoute(adminController,authService);
const cron = new CronJob(taskUsecase);

cron.checkTaskExpire()
route.use('/auth',authRoute.getRouter())
route.use('/user',userRoute.getRouter())
route.use('/admin',adminRoute.getRouter())


export default route