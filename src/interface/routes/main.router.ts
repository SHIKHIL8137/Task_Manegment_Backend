import {Router} from 'express'
import { AuthRoute } from './routers/auth.router';

import { HttpStatus } from '../../shared/constents/httpStatus';
import { UserRoute } from './routers/user.router';
import { AdminRoute } from './routers/admin.router';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { AdminController } from '../controllers/admin.controller';

const route = Router();


const authController = new AuthController(HttpStatus);
const userController = new UserController(HttpStatus);
const adminController = new AdminController(HttpStatus)
const authRoute = new AuthRoute(authController)
const userRoute = new UserRoute(userController);
const adminRoute = new AdminRoute(adminController);

route.use('/auth',authRoute.getRouter())
route.use('/user',userRoute.getRouter())
route.use('/admin',adminRoute.getRouter())


export default route