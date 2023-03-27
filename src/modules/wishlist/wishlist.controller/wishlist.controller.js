import { userModel } from "../../../../DB/models/user.model.js";

export const AddtoWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        let addtowishlist = await userModel.findByIdAndUpdate(req.user._id, {
            $addToSet: { wishlist: productId } // addToSet بتضيف العنصر بدون تكرار ____ push اضافة مع تكرار ____
        })

        if (!addtowishlist) {
            return res.status(401).json({ message: 'fail to update wishlist' })

        } else {
            return res.status(200).json({ message: 'success' })

        }

    } catch (error) {
        return res.status(401).json({ message: 'catch AddtoWishlist ', error })


    }

}

export const DeleteWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        let addtowishlist = await userModel.findByIdAndUpdate(req.user._id, {
            $pull: { wishlist: productId }                      // pull حذف  remove  حسب شرط معين  ___
        })

        if (!addtowishlist) {
            return res.status(401).json({ message: 'fail to delete wishlist' })

        } else {
            return res.status(200).json({ message: 'success' })

        }

    } catch (error) {
        return res.status(401).json({ message: 'catch AddtoWishlist ', error })


    }

}
