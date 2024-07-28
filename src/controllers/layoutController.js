import layoutModel from "../models/layoutModel"
import cloudinary from "cloudinary"

export const createLayout = async (req, res, next) => {
  try {
    const { type } = req.body

    const checkTypePresent = await layoutModel.findOne({ type })

    if(checkTypePresent) {
      return res.status(400).json({
        success: false,
        message: `${type} already exists`
      })
    }

    if(type === 'BANNER') {
      const { image, title, sub_title } = req.body

      const myCloud = await cloudinary.v2.uploader.upload(image, { folder: 'layouts' })

      const banner = {
        type,
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        sub_title,
      }
      await layoutModel.create(banner)
    }

    if (type === 'FAQ') {
      const { faq } = req.body
      const data = {
        type,
        faq
      }
      await layoutModel.create(data)
    }

    if (type === 'CATEGORIES') {
      const { categories } = req.body
      const data = {
        type,
        categories
      }
      await layoutModel.create(data)
    }

    res.status(200).json({
      success: true,
      message: "Layout created successfully"
    })

  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

// Edit layout
export const editLayout = async (req, res, next) => {
  try {
    const { type } = req.body
    const layoutId = req.params.layout_id

    const layout = await layoutModel.findById(layoutId)

    if(!layout) {
      return res.status(404).json({
        success: false,
        message: "Layout not found"
      })
    }

    if(type === 'BANNER') {
      const { image, title, sub_title } = req.body

      if(image) {
        if(layout.image.public_id) {
          await cloudinary.v2.uploader.destroy(layout.image.public_id)
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, { folder: 'layouts' })
        layout.image.public_id = myCloud.public_id
        layout.image.url = myCloud.secure_url
      }
      layout.title = title
      layout.sub_title = sub_title
      layout.save()
    }

    if (type === 'FAQ') {
      const { faq } = req.body
      layout.faq = faq
      layout.save()
    }

    if (type === 'CATEGORIES') {
      const { categories } = req.body
      layout.categories = categories
      layout.save()
    }

    res.status(200).json({
      success: true,
      message: "Layout updated successfully"
    })
    
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

// Get layout -- admin
export const getLayout = async (req, res, next) => {
  try {
    const { type } = req.body

    const layout = await layoutModel.findOne({ type })

    if(!layout) {
      return res.status(404).json({
        success: false,
        message: "Layout not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Layout fetched successfully",
      data: layout
    })

  } catch (error) {
    console.error(error.message);
    next(error)
  }
}