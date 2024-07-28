import { Router } from "express";
import CartsController from "../controllers/carts";

const cartsRouter = Router();

const cartsController = new CartsController();

cartsRouter.get("/", cartsController.getAllCarts);
cartsRouter.get("/:id", cartsController.getCartDetail);
cartsRouter.get("/user/:id", cartsController.getCartUser);
cartsRouter.post("/", cartsController.createCart);
cartsRouter.put("/:id", cartsController.updateCart);
cartsRouter.put("/product/:id", cartsController.updateProductCart);
cartsRouter.delete("/:id", cartsController.deleteCart);
cartsRouter.delete("/userid/:userid/productid/:productid", cartsController.deleteProductCart);

export default cartsRouter;