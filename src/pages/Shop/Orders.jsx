import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashBoard/Layout/DashboardLayout";
import ComponentLoader from "../../components/common/ComponentLoader";
import Button from "../../components/common/Button";
import { fetchOrders, cancelOrder } from "../../redux/slices/shopSlice";

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.shop.orders || []);
  const loading = useSelector((s) => s.shop.loading.orders);
  const error = useSelector((s) => s.shop.error.orders);

  const [page] = useState(1);

  useEffect(() => {
    dispatch(fetchOrders({ page, limit: 20 }));
  }, [dispatch, page]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await dispatch(cancelOrder({ orderId, reason: "User cancelled" })).unwrap();
      // refresh list
      dispatch(fetchOrders({ page, limit: 20 }));
    } catch (err) {
      // swallow - the slice will handle error state
      console.error("Failed to cancel order", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold">My Orders</h2>
          <Link to="/login/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>

        {loading ? (
          <ComponentLoader message="Loading orders..." />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg p-4">
            {String(error)}
          </div>
        ) : orders && orders.length ? (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Order</div>
                  <div className="font-semibold">{o.orderNumber || o._id}</div>
                  <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-400">Items</div>
                  <div className="font-semibold">{(o.items||[]).length}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400">Total</div>
                  <div className="font-semibold">${(o.total||0).toFixed(2)}</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-400">Status</div>
                  <div className="font-semibold capitalize">{o.status}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/login/shop/orders/${o._id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                  {o.status === "pending" && (
                    <Button size="sm" variant="danger" onClick={()=>handleCancel(o._id)}>Cancel</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">You have no orders yet.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
