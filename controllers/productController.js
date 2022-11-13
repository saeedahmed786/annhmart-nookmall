const Product = require('../models/productModel');
const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinary');
var fs = require('fs');

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().limit(20)
    .populate('mainCategory subCategory').exec();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}

exports.getLimitedProducts = async (req, res) => {
  const PAGE_SIZE = 20;
  const page = parseInt(req.params.page || "0")
  const products = await Product.find().limit(PAGE_SIZE).skip(PAGE_SIZE * page)
    .populate('mainCategory subCategory').exec();
  const count = await Product.countDocuments({});
  if (products) {
    res.status(200).send({ products, count });
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}

exports.getLimitedProductsByCat = async (req, res) => {
  const PAGE_SIZE = 20;
  const page = parseInt(req.body.pageNo || "0");
  const products = await Product.find({ $or: [{ mainCategory: req.params.id }, { subCategory: req.params.id }] })
    .limit(PAGE_SIZE).skip(PAGE_SIZE * page)
    .populate('mainCategory subCategory').exec();
  const count = await Product.find({ $or: [{ mainCategory: req.params.id }, { subCategory: req.params.id }] }).countDocuments({});
  if (products) {
    res.status(200).send({ products, count });
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}


exports.getAllNewArrivalProducts = async (req, res) => {
  const products = await Product.find().limit(4).sort({ "createdAt": '-1' })
    .populate('mainCategory subCategory').exec();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}

exports.getAllAdminProducts = async (req, res) => {
  const products = await Product.find({ user: req.params.id })
    .populate('mainCategory subCategory').exec();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}

exports.getProductById = async (req, res) => {
  const findProduct = await Product.findOne({ _id: req.params.id }).populate('user').exec();
  if (findProduct) {
    res.status(200).send(findProduct);
  }
}

exports.getProductByCategory = async (req, res) => {
  const findProduct = await Product.find({ $or: [{ mainCategory: req.params.id }, { subCategory: req.params.id }] })
    .limit(20)
    .populate('mainCategory subCategory').exec();
  if (findProduct) {
    res.status(200).json(findProduct);
  } else {
    res.json({ errorMessage: 'No products found' })
  }
}


exports.uploadProduct = async (req, res) => {
  const product = new Product({
    title: req.body.title,
    subTitle: req.body.subTitle,
    description: req.body.description,
    user: req.user._id,
    price: req.body.price,
    qty: req.body.qty,
    offer: req.body.offer,
    tag: req.body.tag,
    featured: req.body.featured,
    mainCategory: req.body.mainCategory,
    productPictures: req.body.variants
  });
  if (req.body.subCategory) {
    product.subCategory = req.body.subCategory;
  }

  await product.save(((error, result) => {
    if (error) {
      res.status(400).json({ errorMessage: 'Failed to create product. Please try again', error })
    }
    if (result) {
      res.status(200).send({ successMessage: 'Product created successfully', result });
    }

  }))
}



exports.updateProduct = async (req, res) => {
  const findProduct = await Product.findById({ _id: req.params.id });
  if (findProduct) {
    findProduct.title = req.body.title;
    findProduct.subTitle = req.body.subTitle;
    findProduct.description = req.body.description;
    findProduct.price = req.body.price;
    findProduct.user = req.user._id;
    findProduct.qty = req.body.qty;
    findProduct.tag = req.body.tag;
    findProduct.offer = req.body.offer;
    findProduct.featured = req.body.featured;
    findProduct.mainCategory = req.body.mainCategory;
    findProduct.productPictures = req.body.variants;
    findProduct.subCategory = req.body.subCategory;

    await findProduct.save(((error, result) => {
      if (error) {
        res.status(400).json({ errorMessage: 'Failed to update product. Please try again', error })
      }
      if (result) {
        res.status(200).send({ successMessage: 'Product updated successfully', result });
      }
    }))
  }
  else {
    res.status(404).json({ errorMessage: 'Product not found' });
  }

}


exports.deleteProduct = async (req, res) => {
  const product = await Product.findById({ _id: req.params.id });
  if (product) {
    product.productPictures.map(async pic => {
      await cloudinaryCon.uploader?.destroy(pic?.cloudinary_id);
    });
    product.remove();
    res.status(200).json({ successMessage: 'Product Deleted Successfully' });
  }
}

exports.getRelatedProducts = async (req, res) => {
  const products = await Product.find({ $or: [{ mainCategory: req.params.id }, { subCategory: req.params.id }] }).exec();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(201).json({ errorMessage: 'No Related Products' });
  }
}


