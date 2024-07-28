import { StatusCodes } from "http-status-codes";
import Order from "../models/OrderModel";
import ApiError from "../utils/ApiError";
import Cart from "../models/CartModel";

class OrdersController {
  // GET /orders
  async getAllOrders(req, res, next) {
    try {
      const orders = await Order.find();
      res.status(StatusCodes.OK).json(orders);
    } catch (error) {
      next(error);
    }
  }
  // GET /orders/:id
  async getOrderDetail(req, res, next) {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) throw new ApiError(404, "Order Not Found");
      res.status(StatusCodes.OK).json(order);
    } catch (error) {
      next(error);
    }
  }
  // POST /orders
  async createOrder(req, res, next) {
    try {
      const newOrder = await Order.create(req.body);
      const cart = await Cart.findOneAndDelete({ user: req.body.user });
      if (!cart) throw new ApiError(404, "Cart Not Found");
      res.status(StatusCodes.CREATED).json({
        message: "Create Order Successfull",
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  }
  // PUT /orders/:id
  async updateOrder(req, res, next) {
    try {
      const updateOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updateOrder) throw new ApiError(404, "Order Not Found");

      res.status(StatusCodes.OK).json({
        message: "Update Order Successfull",
        data: updateOrder,
      });
    } catch (error) {
      next(error);
    }
  }
  // DELETE /orders/:id
  async deleteOrder(req, res, next) {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) throw new ApiError(404, "Order Not Found");
      res.status(StatusCodes.OK).json({
        message: "Delete Order Done",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default OrdersController;