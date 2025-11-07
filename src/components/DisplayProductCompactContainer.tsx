import React from "react";
import {Product} from "@/blueprint/customBlueprints";
import {motion} from "framer-motion";
import {Trash2} from "lucide-react";
interface DisplayProductCompactProps {
    product: Product;
    handleDelete?: (productId: string) => void;
}

const DisplayProductCompactContainer : React.FC<DisplayProductCompactProps> = ({product, handleDelete}) => {
    return (
        <motion.div
            key={product.product_id}
            initial={{ opacity: 1, y: 15 }}
            transition={{ duration: 0.2 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="px-3 py-0.5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50"

        >
            <p className="font-bold text-gray-800 text-lg">{product.productName}</p>

            <div className="flex justify-between" >
                <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Category :</span>{" "}
                    <strong>{product.productCategory}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-0.5">
                    <span className="font-medium text-gray-700">Stock:</span>{" "}
                    <strong>{product.productStock}</strong>
                </p>
            </div>

            <div className="flex justify-between">
                <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Cost Price:</span>{" "}
                    <strong>₹{product.productCostPrice.toLocaleString()}</strong>
                </div>

                <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Selling Price:</span>{" "}
                    <strong>₹{product.productSellingPrice.toLocaleString()}</strong>
                </div>
            </div>
            {handleDelete && (
                <motion.button
                    onClick={() => handleDelete(product.product_id)}
                    whileTap={{ scale: 0.9 }}
                    className="w-full justify-end mt-1 self-end flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-semibold transition-all"
                >
                    <Trash2 size={14} /> Delete
                </motion.button>
            )}
        </motion.div>
    )
};
export default DisplayProductCompactContainer;