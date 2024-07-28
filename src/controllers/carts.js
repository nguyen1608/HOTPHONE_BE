import { StatusCodes } from "http-status-codes";
import Cart from "../models/CartModel";
import ApiError from "../utils/ApiError";
import Product from "../models/ProductModel";

class CartsController {
  // GET /carts
  async getAllCarts(req, res, next) {
    try {
      const carts = await Cart.find().populate({
        path: "products",
        populate: {
          path: "product",
          model: Product,
        },
      });
      res.status(StatusCodes.OK).json(carts);
    } catch (error) {
      next(error);
    }
  }

  // GET /carts/:id
  async getCartDetail(req, res, next) {
    try {
      const cart = await Cart.findById(req.params.id);

      if (!cart) throw new ApiError(404, "Cart Not Found");
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  }

  // GET /carts/user/:id
  async getCartUser(req, res, next) {
    try {
      const cart = await Cart.findOne({ user: req.params.id }).populate({
        path: "products",
        populate: {
          path: "product",
          model: Product,
        },
      });
      if (!cart) throw new ApiError(404, "Cart Not Found");
      res.status(StatusCodes.OK).json(cart);
    } catch (error) {
      next(error);
    }
  }

  // POST /carts
  async createCart(req, res, next) {
    try {
      const { quantity, user, product } = req.body;

      if (!quantity || !user || !product) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required fields");
      }

      let cart = await Cart.findOne({ user });

      if (cart) {
        // Nếu giỏ hàng đã tồn tại, cập nhật giỏ hàng
        const productExisted = cart.products.find(
          (item) => item.product.toString() === product
        );

        if (productExisted) {
          cart.products = cart.products.map((item) =>
            item.product.toString() === product
              ? { product, quantity: item.quantity + quantity }
              : item
          );
        } else {
          cart.products.push({ product, quantity });
        }
        await cart.save();
        res.status(StatusCodes.OK).json({
          message: "Cart updated successfully",
          data: cart,
        });
      } else {
        // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
        cart = new Cart({
          user,
          products: [{ product, quantity }],
        });
        await cart.save();
        res.status(StatusCodes.CREATED).json({
          message: "Add Cart Successfully",
          data: cart,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // POST /carts/update
  async updateProductCart(req, res, next) {
    try {
      const { quantity, user, product } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!quantity || !user || !product) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required fields");
      }

      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ user });
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Cart Not Found",
        });
      }

      // Tìm sản phẩm trong giỏ hàng
      const productExisted = cart.products.find(
        (item) => item.product.toString() === product
      );

      // Cập nhật hoặc thêm sản phẩm
      let newProductCart;
      if (productExisted) {
        newProductCart = cart.products.map((item) =>
          item.product.toString() === product
            ? { product, quantity: quantity }
            : item
        );
      } else {
        newProductCart = [...cart.products, { product, quantity }];
      }

      // Cập nhật giỏ hàng
      const updateCart = await Cart.findByIdAndUpdate(
        cart._id,
        { products: newProductCart },
        { new: true }
      );

      // Trả về phản hồi thành công
      res.status(StatusCodes.OK).json({
        message: "Update Cart Successfully",
        data: updateCart,
      });
    } catch (error) {
      next(error);
    }
  }


  async deleteProductCart(req, res, next) {
    try {
      console.log("req.params", req.params)
      const id = req.params.productid;
      const user = req.params.userid;
      // Kiểm tra nếu có giá trị user và id hợp lệ
     
      if (!user || !id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "User or Product ID is missing",
        });
      }
      
      const cart = await Cart.findOne({ user:user });
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Cart Not Found",
        });
      }
      
      // Lọc sản phẩm và kiểm tra nếu sản phẩm tồn tại trong giỏ hàng
      const newProductCart = cart.products.filter(
        (item) => item.product.toString() !== id
      );
      if (newProductCart.length === cart.products.length) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product Not Found in Cart",
        });
      }

      // Cập nhật giỏ hàng
      const updateCart = await Cart.findByIdAndUpdate(
        cart._id,
        { products: newProductCart },
        { new: true }
      );
      if (!updateCart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Failed to update Cart",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Delete Product Cart Successfully",
        data: updateCart,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCart(req, res, next) {
    try {
      const updateCart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updateCart) throw new ApiError(StatusCodes.NOT_FOUND, "Cart Not Found");

      res.status(StatusCodes.OK).json({
        message: "Update Cart Successfully",
        data: updateCart,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /carts/:id
  async deleteCart(req, res, next) {
    try {
      const cart = await Cart.findByIdAndDelete(req.params.id);
      if (!cart) throw new ApiError(StatusCodes.NOT_FOUND, "Cart Not Found");
      res.status(StatusCodes.OK).json({
        message: "Delete Cart Successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CartsController;
