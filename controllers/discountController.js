const Discount = require('../models/discountModel');

exports.getAllDiscountCodes = async (req, res) => {
    Discount.find()
        .exec((error, discountCodes) => {
            if (error) {
                res.status(404).json({ errorMessage: 'Error in finding Discount Codes' });
            }
            if (discountCodes) {
                res.status(200).send(discountCodes);
            }
        });
}


exports.addDiscountCode = async (req, res) => {
    const dis = new Discount({
        discountCode: req.body.discountCode,
        discount: req.body.discount,
    });

    const newDis = dis.save();
    if (newDis) {
        res.status(200).json({ successMessage: `Discount Code added successfully` });
    } else {
        res.status(400).json('Discount Code is not added. Please Try Again')
    }
}


exports.getDiscountCodeById = async (req, res) => {
    const findDis = await Discount.findById({ _id: req.params.id });
    if (findDis) {
        res.status(200).json(findDis);
    }
    else {
        res.status(400).json({ errorMessage: 'Discount not found. Please try again' });
    }
}


exports.checkDisountCode = async (req, res) => {
    const findDis = await Discount.findOne({ discountCode: req.body.discountCode });
    if (findDis) {
        res.status(200).json(findDis);
    }
    else {
        res.status(400).json({ errorMessage: 'Discount code is not valid or Expired' });
    }
}

exports.updateDiscountCode = async (req, res) => {
    const findDis = await Discount.findById({ _id: req.params.id });
    if (findDis) {
        findDis.discount = req.body.discount;
        findDis.discountCode = req.body.discountCode;

        const newDis = findDis.save();
        if (newDis) {
            res.status(200).json({ successMessage: `Discount Code updated successfully` });
        } else {
            res.status(400).json({ errorMessage: 'Discount Code not updated. Please try again' })
        }
    }
    else {
        res.status(400).json({ errorMessage: 'Discount Code not found. Please try again' });
    }
}

exports.deleteDiscount = async (req, res) => {
    const getDis = await Discount.findById({ _id: req.params.id })
    if (getDis) {
        getDis.remove();
        res.status(200).json({ successMessage: `Discount Code has been deleted successfully` });
    } else {
        res.status(400).json({ errorMessage: 'Discount Code could not be deleted. Please try again' });
    }
}
