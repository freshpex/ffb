import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../common/Button";
import { fetchCart, removeFromCart, updateCartItem, clearCart, createOrder } from "../../redux/slices/shopSlice";
import { useNavigate } from "react-router-dom";
import ComponentLoader from "../common/ComponentLoader";
import { useToast } from "../../context/ToastContext";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((s) => s.shop.cart || { items: [], summary: {} });
  const loading = useSelector((s) => s.shop.loading.cart);

  const user = useSelector((s) => s.user.profile);
  const { showToast } = useToast();
  const [qtyLoading, setQtyLoading] = useState({});
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    if (open) dispatch(fetchCart());
  }, [open, dispatch]);

  const toggle = () => setOpen((v) => !v);

  const handleCheckout = () => {
    setOpen(false);
    navigate("/login/checkout");
  };

  const drawerRef = useRef(null);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    []
  );

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      drawerRef.current?.querySelector("button, a, input")?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const format = (value) => currency.format(Number(value || 0));

  const handleClear = async () => {
    if (!cart.items || cart.items.length === 0) {
      showToast("Cart is already empty", { type: "info" });
      return;
    }
    if (!window.confirm("Clear cart? This will remove all items.")) return;
    try {
      await dispatch(clearCart()).unwrap();
      showToast("Cart cleared", { type: "success" });
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Failed to clear cart", { type: "error" });
    }
  };

  const CartItem = ({ it }) => {
    const pid = it.productId?._id || it.productId;
    const loadingPid = !!qtyLoading[pid];

    const changeQty = async (nextQty) => {
      setQtyLoading((s) => ({ ...s, [pid]: true }));
      try {
        await dispatch(updateCartItem({ productId: pid, quantity: nextQty })).unwrap();
      } catch (err) {
        console.error(err);
        showToast(err?.message || "Failed to update quantity", { type: "error" });
      } finally {
        setQtyLoading((s) => ({ ...s, [pid]: false }));
      }
    };

    const remove = async () => {
      setQtyLoading((s) => ({ ...s, [pid]: true }));
      try {
        await dispatch(removeFromCart({ productId: pid })).unwrap();
        showToast("Item removed", { type: "success" });
      } catch (err) {
        console.error(err);
        showToast(err?.message || "Failed to remove item", { type: "error" });
      } finally {
        setQtyLoading((s) => ({ ...s, [pid]: false }));
      }
    };

    return (
      <div
        key={pid}
        className="flex items-center gap-3 mb-4 bg-gray-800 rounded p-2"
        role="group"
        aria-label={`Cart item ${it.title}`}
      >
        <img
          src={it.productId?.thumbnail || it.thumbnail}
          alt={it.title || "Product"}
          className="w-16 h-16 object-contain"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-100 truncate">{it.title}</div>
          <div className="text-sm text-gray-400">
            {format(it.productId?.price)} × {it.quantity}{" "}
            <span className="ml-2 text-sm text-gray-200 font-medium">({format(it.itemTotal)})</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <Button
              size="small"
              isLoading={loadingPid}
              aria-label={`Increase quantity for ${it.title}`}
              onClick={() => changeQty(it.quantity + 1)}
            >
              +
            </Button>
            <Button
              size="small"
              isLoading={loadingPid}
              aria-label={`Decrease quantity for ${it.title}`}
              onClick={() => changeQty(Math.max(1, it.quantity - 1))}
            >
              −
            </Button>
          </div>
          <Button
            variant="outline"
            size="small"
            onClick={remove}
            isLoading={loadingPid}
            aria-label={`Remove ${it.title} from cart`}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-primary-600 text-white rounded-full p-3 shadow-lg"
        onClick={toggle}
        aria-label="Open cart"
        aria-expanded={open}
      >
        🛒
      </button>

      {/* overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900 text-gray-100 shadow-xl transform transition-transform z-50 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 id="cart-title" className="text-lg font-semibold text-gray-100">
            Your Cart
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={handleClear}
              disabled={loading || (cart.items || []).length === 0}
            >
              Clear
            </Button>
            <Button variant="secondary" size="small" onClick={toggle}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
          {loading ? (
            <ComponentLoader message="Loading cart..." type="table" />
          ) : cart.items && cart.items.length > 0 ? (
            cart.items.map((it) => <CartItem key={it.productId?._id || it.productId} it={it} />)
          ) : (
            <div className="text-center text-gray-400">
              <div className="mb-2">Your cart is empty</div>
              <Button onClick={() => { setOpen(false); navigate("/shop"); }}>
                Continue shopping
              </Button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">Subtotal</div>
            <div className="font-semibold text-gray-100">{format(cart.summary?.subtotal)}</div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">Potential Reward</div>
            <div className="font-semibold text-green-400">
              {format(cart.summary?.potentialReward)}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              fullWidth
              onClick={handleCheckout}
              disabled={(cart.items || []).length === 0 || loading}
            >
              Checkout
            </Button>

            <Button
              variant="primary"
              onClick={async () => {
                if ((cart.items || []).length === 0) return;
                setPayLoading(true);
                try {
                  const shippingAddress = {
                    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "",
                    addressLine1: user?.address?.street || "",
                    city: user?.address?.city || "",
                    country: user?.address?.country || "",
                  };

                  if (!shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.country) {
                    showToast("Please complete your shipping address before paying — redirecting to checkout", {
                      type: "info",
                    });
                    navigate("/login/checkout");
                    setOpen(false);
                    return;
                  }

                  const res = await dispatch(createOrder({ shippingAddress, paymentMethod: "balance" })).unwrap();
                  showToast("Payment successful — reward credited", { type: "success" });
                  setOpen(false);
                  navigate(`/login/shop/orders/${res.data.order._id}`);
                } catch (err) {
                  console.error(err);
                  showToast(err?.message || "Payment failed", { type: "error" });
                } finally {
                  setPayLoading(false);
                }
              }}
              isLoading={payLoading}
              disabled={(cart.items || []).length === 0 || loading}
            >
              Pay
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
