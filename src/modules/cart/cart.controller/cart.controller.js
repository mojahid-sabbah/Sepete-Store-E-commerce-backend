import { cartModel } from "../../../../DB/models/cart.model.js";

export const Addtocart = async (req, res) => {
    try {
        const { _id } = req.user
        const { products } = req.body;
        const findcart = await cartModel.findOne({ userId: _id })
        if (!findcart) {
            const cart = await cartModel.create({ userId: _id, products })
            return res.status(201).json({ message: 'Added succefully', cart })
        } else {
            /////////////////////////////////////////////////////
            for (const product of products) {
                let match = false;
                    for (let i = 0; i < findcart.products.length ; i++) {
                    
                            if (product.productId == findcart.products[i].productId) {
                                findcart.products[i] = product;
                                match = true;
                                break;
                            }
                    }
                if (!match) { //(  (!false) >> = true  نفي النفي موجب)اذا ما لقي المنتج بالسلة وما كان الاي دي تاع المنتج اللي بعتناه موجود بالسلة. بفوت هون وبضيفه عالسلة
                    findcart.products.push(product)
                }
            }
            //////////////////////////////////////////////
            const updatecart = await cartModel.findOneAndUpdate({ userId: _id }, { products: findcart.products }, { new: true })
            if (updatecart) {
                return res.status(201).json({ message: 'success', updatecart })
            } else {
                return res.status(401).json({ message: 'fail to add ' })
            }
        }
    } catch (error) {
        return res.status(401).json({ message: 'catch Add to cart ', error })

    }
}
