import { Router } from "express";
import OrdersController from "../controllers/orders";

const ordersRouter = Router();

const ordersController = new OrdersController();

ordersRouter.get("/", ordersController.getAllOrders);
ordersRouter.get("/:id", ordersController.getOrderDetail);
ordersRouter.post("/", ordersController.createOrder);
ordersRouter.put("/:id", ordersController.updateOrder);
ordersRouter.delete("/:id", ordersController.deleteOrder);

export default ordersRouter;