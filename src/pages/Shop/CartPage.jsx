import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart } from "../../redux/slices/shopSlice";
import Button from "../../components/common/Button";
import ComponentLoader from "../../components/common/ComponentLoader";
import DashboardLayout from "../../components/DashBoard/Layout/DashboardLayout";
import { useToast } from "../../context/ToastContext";

export default function CartPage(){
  const dispatch = useDispatch();
  const cart = useSelector((s)=>s.shop.cart);
  const loading = useSelector((s)=>s.shop.loading.cart);
  const { showToast } = useToast();

  useEffect(()=>{
    dispatch(fetchCart());
  },[]);

  const safeId = (it) => String(it?.productId?._id || it?.productId || "");

  if(loading) return (
    <DashboardLayout>
      <div className="p-6"><ComponentLoader message="Loading cart..." type="table" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        {cart && cart.items && cart.items.length>0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {cart.items.map((it)=> (
                <div key={it.productId._id||it.productId} className="flex items-center gap-4 p-4 bg-gray-800/60 border border-gray-700 rounded-lg mb-4">
                  <img src={it.productId?.thumbnail||it.thumbnail||"/images/placeholder.png"} className="w-24 h-24 object-contain bg-gray-900 rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{it.title}</div>
                    <div className="text-sm text-gray-400">${(it.price||0).toFixed(2)} × {it.quantity}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="small"
                      onClick={async () => {
                        const pid = safeId(it);
                        if (!pid) return;
                        try {
                          await dispatch(updateCartItem({ productId: pid, quantity: it.quantity + 1 })).unwrap();
                        } catch (err) {
                          showToast(String(err || "Failed to update cart"), { type: "error" });
                        }
                      }}
                    >
                      +
                    </Button>
                    <Button
                      size="small"
                      onClick={async () => {
                        const pid = safeId(it);
                        if (!pid) return;
                        try {
                          await dispatch(updateCartItem({ productId: pid, quantity: Math.max(1, it.quantity - 1) })).unwrap();
                        } catch (err) {
                          showToast(String(err || "Failed to update cart"), { type: "error" });
                        }
                      }}
                    >
                      -
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={async () => {
                        const pid = safeId(it);
                        if (!pid) return;
                        try {
                          await dispatch(removeFromCart(pid)).unwrap();
                          showToast("Item removed", { type: "success" });
                        } catch (err) {
                          showToast(String(err || "Failed to remove item"), { type: "error" });
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 bg-gray-800/60 border border-gray-700 p-4 rounded-lg h-fit">
              <div className="font-semibold">Order Summary</div>
              <div className="mt-3 flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span>${(cart.summary?.subtotal||0).toFixed(2)}</span></div>
              <div className="mt-2 flex justify-between text-sm"><span className="text-gray-400">Potential Reward</span><span className="text-green-400 font-semibold">${(cart.summary?.potentialReward||0).toFixed(2)}</span></div>
              <div className="mt-4">
                <Button fullWidth onClick={()=> window.location.href='/login/checkout'}>Checkout</Button>
              </div>
            </div>
          </div>
        ) : (<div className="text-gray-400">Your cart is empty</div>)}
      </div>
    </DashboardLayout>
  )
}
