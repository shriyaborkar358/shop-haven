import Order from "../models/Order.js";

const postOrders = async (req, res) => {
  const { products, deliveryAddress, phone, paymentMethod } = req.body;

  if (!products || !deliveryAddress || !phone || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "products, deliveryAddress, phone, paymentMethod are required",
    });
  }

  let totalBill = 0;

  products.forEach((products) => {
    totalBill += products.price * products.quantity;
  });

  try {
    const newOrder = new Order({
      userId: req.user._id,
      products,
      totalBill,
      deliveryAddress,
      phone,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      data: savedOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const putOrders = async (req, res) => {
  const user = req.user;
  console.log(user);

  const { id } = req.params;

  let order ;

  try {
     order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }

  if (user.role == "user" && order.userId != user._id) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to update this order",
    });
  }

  if(user.role=="user"){
    order.status = req.body.status || order.status
  }

  return res.json({
    success: true,
    message: "Order updated successfully",
  });
};

export { postOrders, putOrders };
