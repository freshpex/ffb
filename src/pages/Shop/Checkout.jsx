import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/common/Button";
import { createOrder } from "../../redux/slices/shopSlice";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashBoard/Layout/DashboardLayout";
import ComponentLoader from "../../components/common/ComponentLoader";
import { useToast } from "../../context/ToastContext";

export default function Checkout(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((s)=>s.shop.cart);
  const user = useSelector((s)=>s.user.profile);
  const [address, setAddress] = useState({ fullName: user?.firstName + ' ' + user?.lastName || '', addressLine1: '', city: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState("balance");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handlePlaceOrder = async ()=>{
    setLoading(true);
    try{
      if (!address.addressLine1 || !address.city || !address.country || !address.fullName) {
        showToast('Please complete your shipping address before placing the order', { type: 'error' });
        setLoading(false);
        return;
      }

      const payload = { shippingAddress: address, paymentMethod };
      const res = await dispatch(createOrder(payload)).unwrap();
      showToast('Order created successfully', { type: 'success' });
      navigate(`/login/shop/orders/${res.data.order._id}`);
    }catch(err){
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Order failed';
      showToast(msg, { type: 'error' });
    }finally{setLoading(false)}
  }

  if(!cart) return (
    <DashboardLayout>
      <div className="p-6">Cart is empty</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-800/60 border border-gray-700 p-4 rounded-lg">
              <div className="font-semibold mb-3">Shipping Address</div>
              <input className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 mb-2" placeholder="Full name" value={address.fullName} onChange={(e)=>setAddress({...address, fullName: e.target.value})} />
              <input className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 mb-2" placeholder="Address line 1" value={address.addressLine1} onChange={(e)=>setAddress({...address, addressLine1: e.target.value})} />
              <input className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 mb-2" placeholder="City" value={address.city} onChange={(e)=>setAddress({...address, city: e.target.value})} />
              <input className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 mb-2" placeholder="Country" value={address.country} onChange={(e)=>setAddress({...address, country: e.target.value})} />
            </div>

            <div className="mt-4 bg-gray-800/60 border border-gray-700 p-4 rounded-lg">
              <div className="font-semibold mb-3">Payment Method</div>
              <div className="text-sm text-gray-400 mb-2">
                Balance: ${(Number(user?.balance || 0)).toFixed(2)} · Bonus: ${(Number(user?.bonusBalance || 0)).toFixed(2)}
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700"
              >
                <option value="balance">Pay with Balance</option>
                <option value="bonus">Pay with Bonus Balance</option>
              </select>
              <div className="mt-2 text-xs text-gray-500">
                {paymentMethod === "balance"
                  ? "Cashback reward is credited to your BONUS balance when paying with Balance."
                  : "No cashback reward when paying with Bonus balance."}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-gray-800/60 border border-gray-700 p-4 rounded-lg">
              <div className="font-semibold mb-2">Order Summary</div>
              <div className="mb-2 text-sm text-gray-400">Items: {(cart.items||[]).length}</div>
              <div className="mb-2 text-sm">Subtotal: ${(cart.summary?.subtotal||0).toFixed(2)}</div>
              <div className="mb-4 text-sm text-green-400">
                Reward: ${(
                  paymentMethod === "balance" ? (cart.summary?.potentialReward || 0) : 0
                ).toFixed(2)}
              </div>
              <Button fullWidth isLoading={loading} onClick={handlePlaceOrder}>
                Place Order ({paymentMethod === "balance" ? "Pay with Balance" : "Pay with Bonus"})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
