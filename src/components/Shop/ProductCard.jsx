import { useDispatch } from "react-redux";
import Button from "../common/Button";
import { addToCart } from "../../redux/slices/shopSlice";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../../context/ToastContext";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
    const [adding, setAdding] = useState(false);
    const { showToast } = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
      setAdding(true);
      dispatch(addToCart({ productId: product._id || product.externalId, quantity: 1 }))
        .unwrap()
        .then(() => {
          showToast("Item added to cart", { type: "success" });
        })
        .catch((err) => {
          showToast(err?.message || "Failed to add to cart", { type: "error" });
        })
        .finally(() => setAdding(false));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <Link to={`/login/shop/${product._id || product.externalId}`} className="block">
        <div className="w-full h-44 bg-gray-700 flex items-center justify-center">
          <img
            src={product.thumbnail || product.images?.[0] || "/images/placeholder.png"}
            alt={product.title}
            className="object-contain h-40 w-full"
          />
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-100 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xs text-gray-300 mt-2 flex-1">{product.description?.slice(0, 100)}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-primary-300">${(product.price || 0).toFixed(2)}</div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</div>
            )}
          </div>
            <Button size="small" variant="primary" onClick={handleAdd} isLoading={adding}>
              {adding ? "Adding..." : "Add"}
            </Button>
        </div>
      </div>
    </div>
  );
}
