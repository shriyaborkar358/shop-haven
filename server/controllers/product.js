import Product from "../models/Product.js";

const postProducts = async (req, res) => {
  const {
    name,
    shortDescription,
    longDescription,
    price,
    currentPrice,
    category,
    images,
    tags,
  } = req.body;

  const mandatoryFields = [
    "name",
    "shortDescription",
    "longDescription",
    "price",
    "category",
    "images",
  ];

  for(const field of mandatoryFields) {
    if(!req.body[field]) {
      return res
        .status(400)
        .json({ success: false, message: `${field} is required` });
    }
  }

  const newProduct = new Product({
    name,
    shortDescription,
    longDescription,
    price,
    currentPrice,
    category,
    images,
    tags,
  });

  try{
    const savedProduct = await newProduct.save();

    return res.json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  }
  catch(e){
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

export { postProducts };
