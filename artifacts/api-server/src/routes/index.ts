import { Router, type IRouter } from "express";
import healthRouter from "./health";
import talesRouter from "./tales";

const router: IRouter = Router();

router.use(healthRouter);
router.use(talesRouter);

export default router;
