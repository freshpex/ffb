import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, addToCart, createOrder } from "../../redux/slices/shopSlice";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import ComponentLoader from "../../components/common/ComponentLoader";
import { useToast } from "../../context/ToastContext";
import DashboardLayout from "../../components/DashBoard/Layout/DashboardLayout";

export default function ProductDetail(){
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((s)=>s.shop.currentProduct);
  const loading = useSelector((s)=>s.shop.loading.products);

  const [buying, setBuying] = useState(false);
  const { showToast } = useToast();
  const user = useSelector((s)=>s.user.profile);
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(getProductById(id));
  },[id, dispatch]);

  if(loading || !product) return (
    <DashboardLayout>
      <div className="p-6"><ComponentLoader message="Loading product..." type="default" /></div>
    </DashboardLayout>
  );

  const handleAdd = ()=>{
    dispatch(addToCart({ productId: product._id || product.externalId, quantity: 1 }));
  }

  const handleBuyNow = async () => {
    setBuying(true);
    try {
      await dispatch(addToCart({ productId: product._id || product.externalId, quantity: 1 })).unwrap();
      const shippingAddress = {
        fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "",
        addressLine1: user?.address?.street || "",
        city: user?.address?.city || "",
        country: user?.address?.country || "",
      };

      if (!shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.country) {
        showToast("Please complete your shipping address to buy now — redirecting to checkout", { type: "info" });
        navigate("/login/checkout");
        return;
      }

      const res = await dispatch(createOrder({ shippingAddress, paymentMethod: "balance" })).unwrap();
      showToast("Purchase successful — reward credited", { type: "success" });
      navigate(`/login/shop/orders/${res.data.order._id}`);
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Purchase failed", { type: "error" });
    } finally {
      setBuying(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800/60 border border-gray-700 rounded-lg p-4">
            <img
              src={product.images?.[0]||product.thumbnail||"/images/placeholder.png"}
              alt={product.title}
              className="w-full h-96 object-contain bg-gray-900 rounded"
            />
          </div>
          <div className="lg:col-span-1 bg-gray-800/60 border border-gray-700 rounded-lg p-4">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <div className="text-xl text-primary-400 font-semibold mt-2">${(product.price||0).toFixed(2)}</div>
            <p className="mt-4 text-gray-300">{product.description}</p>

            <div className="mt-6 flex items-center gap-2">
              <Button onClick={handleAdd}>Add to cart</Button>
              <Button className="ml-2" variant="outline" isLoading={buying} onClick={handleBuyNow}>
                {buying ? "Processing..." : "Buy now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
