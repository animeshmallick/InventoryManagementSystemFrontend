import React from "react";
import { useRouter } from "next/navigation";
import {Product} from "@/blueprint/customBlueprints";
import {motion} from "framer-motion";
interface DisplayProductCompactProps {
    product: Product;
    handleDelete?: (productId: string) => void;
}

const DisplayProductCompactContainer : React.FC<DisplayProductCompactProps> = ({product, handleDelete}) => {

    const router = useRouter();

    // Navigate to Product Details Page
    const handleClick = () => {
        router.push(`/Product/${product.product_id}`);
    };
    return (
        <motion.div
            key={product.product_id}
            initial={{ opacity: 1, y: 15 }}
            transition={{ duration: 0.2 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
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
        </motion.div>
    )
};
export default DisplayProductCompactContainer;