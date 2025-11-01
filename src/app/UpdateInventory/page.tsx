// "use client";
//
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// // import { verifyLogin } from "@/helpers/LoginHelper";
// import UpdateInventoryForm from "@/components/UpdateInventoryForm";
// import SuccessMessage from "@/components/SuccessMessage";
//
// interface UpdatedProduct {
//     product_id: string;
//     productName: string;
//     productStock: number;
//     productPrice: number;
//     lastUpdatedBy: string;
//     lastUpdatedAt: string;
// }
//
// const UpdateInventoryPage = () => {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");
//     const [updatedProduct, setUpdatedProduct] = useState<UpdatedProduct | null>(null);
//
//     //Verify login on mount
//     useEffect(() => {
//         const checkLogin = async () => {
//             try {
//                 const res = await verifyLogin();
//                 if (!res.success) {
//                     router.push("/Login");
//                 }
//             } catch (err) {
//                 router.push("/Login");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         checkLogin();
//     }, [router]);
//
//
//     const handleUpdateInventory = async (updateData: {
//         productId: string;
//         productQuantity: number;
//         productPrice: number;
//         requestType: string;
//     }) => {
//         setLoading(true);
//         setSuccessMessage("");
//         setUpdatedProduct(null);
//
//         try {
//             const res = await fetch("http://localhost:7070/updateInventory", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 credentials: "include",
//                 body: JSON.stringify(updateData),
//             });
//
//             const data = await res.json();
//             if (res.status !== 200) throw new Error(data.message || "Failed to update inventory");
//
//             setSuccessMessage(data.message || "Inventory updated successfully!");
//             setUpdatedProduct(data.product);
//         } catch (err) {
//             setSuccessMessage("Error updating inventory");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200 p-6">
//             <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//                 Update Inventory
//             </h1>
//
//             {/* Success Message */}
//             <SuccessMessage message={successMessage} />
//
//             {/* Updated product details */}
//             {updatedProduct && (
//                 <div className="bg-white shadow-md rounded-xl p-4 mb-6 w-full max-w-lg border border-gray-200">
//                     <h2 className="text-lg font-semibold text-gray-800 mb-2">
//                         Updated Product Details
//                     </h2>
//                     <ul className="text-gray-700 space-y-1">
//                         <li><strong>ID:</strong> {updatedProduct.product_id}</li>
//                         <li><strong>Name:</strong> {updatedProduct.productName}</li>
//                         <li><strong>Stock:</strong> {updatedProduct.productStock}</li>
//                         <li><strong>Price:</strong> ₹{updatedProduct.productPrice}</li>
//                         <li>
//                             <strong>Last Updated At:</strong>{" "}
//                             {new Date(updatedProduct.lastUpdatedAt).toLocaleString()}
//                         </li>
//                         <li><strong>Updated By:</strong> {updatedProduct.lastUpdatedBy}</li>
//                     </ul>
//                 </div>
//             )}
//
//             {/* Update Form */}
//             <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
//                 <UpdateInventoryForm onSubmit={handleUpdateInventory} loading={loading} />
//             </div>
//
//             {/* Back Button */}
//             <button
//                 onClick={() => router.push("/Dashboard")}
//                 className="w-full max-w-lg px-2 py-2 rounded-lg font-semibold shadow-md text-black transition bg-red-600 hover:bg-blue-300"
//             >
//                 ← Back to Dashboard
//             </button>
//         </div>
//     );
// };
//
// export default UpdateInventoryPage;
