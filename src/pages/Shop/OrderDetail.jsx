import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../components/DashBoard/Layout/DashboardLayout";
import ComponentLoader from "../../components/common/ComponentLoader";
import Button from "../../components/common/Button";
import { fetchOrderById } from "../../redux/slices/shopSlice";

export default function OrderDetail() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const loading = useSelector((s) => s.shop.loading.orders);
  const order = useSelector((s) => s.shop.currentOrder);
  const error = useSelector((s) => s.shop.error.orders);

  useEffect(() => {
    if (!orderId) return;
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <Link to="/login/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>

        {loading ? (
          <ComponentLoader message="Loading order..." type="default" />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg p-4">
            {String(error)}
          </div>
        ) : !order ? (
          <div className="text-gray-400">Order not found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-400">Order Number</div>
                    <div className="text-lg font-semibold">{order.orderNumber || order._id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Status</div>
                    <div className="text-lg font-semibold capitalize">{order.status}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <div className="font-semibold mb-3">Items</div>
                <div className="space-y-3">
                  {(order.items || []).map((it, idx) => (
                    <div key={it._id || it.productId?._id || idx} className="flex items-center gap-3">
                      <img
                        src={it.thumbnail || it.productId?.thumbnail || "/images/placeholder.png"}
                        alt={it.title}
                        className="w-14 h-14 object-contain bg-gray-900 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{it.title}</div>
                        <div className="text-sm text-gray-400">
                          ${(it.price || 0).toFixed(2)} × {it.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">${(it.subtotal || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <div className="font-semibold mb-3">Summary</div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Shipping</span>
                  <span>${(order.shippingFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Tax</span>
                  <span>${(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Total</span>
                  <span className="font-semibold">${(order.total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-4 pt-3 border-t border-gray-700">
                  <span className="text-gray-400">Cashback (200%)</span>
                  <span className="font-semibold text-green-400">${(order.rewardAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
