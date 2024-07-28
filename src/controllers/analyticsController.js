import getLast12MonthsData from "../helpers/analyticsHelper"
import coursesModel from "../models/coursesModel";
import ordersModel from "../models/ordersModel";
import usersModel from "../models/usersModel"


// analytics for users - admin only
export const userAnalytics = async (req, res, next) => {
  try {
    const analytics = await getLast12MonthsData(usersModel)

    res.status(200).json({
      success: true,
      message: "User analytics fetched successfully",
      data: analytics
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

// Get courses analytics -- admin only
export const courseAnalytics = async (req, res, next) => {
  try {
    const analytics = await getLast12MonthsData(coursesModel)

    res.status(200).json({
      success: true,
      message: "Course analytics fetched successfully",
      data: analytics
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

// Get orders analytics -- admin only
export const orderAnalytics = async (req, res, next) => {
  try {
    const analytics = await getLast12MonthsData(ordersModel)

    res.status(200).json({
      success: true,
      message: "Order analytics fetched successfully",
      data: analytics
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}