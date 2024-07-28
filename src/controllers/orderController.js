import moment from "moment";
import coursesModel from "../models/coursesModel";
import notificationsModel from "../models/notificationsModel";
import ordersModel from "../models/ordersModel";
import usersModel from "../models/usersModel";
import { sendOrderDetailsEmail } from "../utils/mailer";

// Create a new order
export const createOrder = async (req, res, next) => {
  try {
    const {_id: userId, courses, email} = req.user;
    const { course_id, payment_info } = req.body

    if(courses.includes(course_id)) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course"
      })
    }

    const courseDetail = await coursesModel.findById(course_id)

    if(!courseDetail) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    const data = { 
      user_id: userId,
      course_id,
      payment_info,
      status: "confirmed",
    }

    const order = await ordersModel.create(data)

    // send mail to the user
    const orderDetails = {
      course: courseDetail.name,
      price: courseDetail.price,
      order_id: order._id.toString(),
      date: moment().format('DD-MM-YYYY'),
      status: order.status
    }

    await sendOrderDetailsEmail(email, orderDetails)

    // update the user's course history
    await usersModel.findByIdAndUpdate(userId, 
      {
        $push: {
          courses: course_id 
        } 
      }, { new: true }
    )

    // update the course's stock
    await coursesModel.findByIdAndUpdate(course_id, { $inc: { total_purchase: +1 } }, { new: true })
    
    // Implement notification system
    await notificationsModel.create({
      user_id: userId,
      title: "order_placed",
      message: `You have a new order from ${courseDetail.name}`,
    })

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
    
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

// Get all orders for admin user
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await ordersModel.find().populate("user_id course_id")

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}