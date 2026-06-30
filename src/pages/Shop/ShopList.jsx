import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/Shop/ProductCard";
import ComponentLoader from "../../components/common/ComponentLoader";
import { getCachedProducts, searchProducts } from "../../redux/slices/shopSlice";
import Button from "../../components/common/Button";
import DashboardLayout from "../../components/DashBoard/Layout/DashboardLayout";
import { selectUserBalance, selectUserBonusBalance } from "../../redux/slices/userSlice";
import {
  fetchBonusConversionStatus,
  convertBonusBalance,
  selectBonusStatus,
  selectBonusStatusLoading,
  selectBonusConvertLoading,
} from "../../redux/slices/userSlice";
import { useToast } from "../../context/ToastContext";

export default function ShopList(){
  const dispatch = useDispatch();
  const { products, loading, pagination, filters } = useSelector((s)=>s.shop || {});
  const balance = useSelector(selectUserBalance);
  const bonusBalance = useSelector(selectUserBonusBalance);
  const bonusStatus = useSelector(selectBonusStatus);
  const bonusStatusLoading = useSelector(selectBonusStatusLoading);
  const converting = useSelector(selectBonusConvertLoading);
  const [query, setQuery] = useState("");
  const [convertAmount, setConvertAmount] = useState("");

  const { showToast } = useToast();

  useEffect(()=>{
    dispatch(getCachedProducts({ page:1, limit:20 }));
  },[]);

  useEffect(() => {
    dispatch(fetchBonusConversionStatus());
  }, [dispatch]);

  const handleSearch = ()=>{
    dispatch(searchProducts({ query, page:1, limit:20 }));
  }

  const handleConvert = async () => {
    try {
      const amount = convertAmount?.trim() ? Number(convertAmount) : undefined;

      const eligibleNow = bonusStatus?.eligible ?? false;
      const minBonusConversionAmount = Number(bonusStatus?.minBonusConversionAmount || 0) || 0;
      const hasConvertedBefore = !!bonusStatus?.hasConvertedBefore;

      // If user is deposit-eligible, enforce/communicate the tiered minimum after they click convert.
      if (eligibleNow && minBonusConversionAmount > 0) {
        const planned =
          amount === undefined || amount === null || amount === ""
            ? Number(bonusBalance || 0)
            : Number(amount);

        if (!Number.isFinite(planned) || planned <= 0) {
          showToast("Enter a valid conversion amount", { type: "error" });
          return;
        }

        if (planned < minBonusConversionAmount) {
          showToast(
            `Minimum bonus conversion is $${minBonusConversionAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${hasConvertedBefore ? " (subsequent conversions)" : " (first conversion)"}`,
            { type: "info" },
          );
          return;
        }
      }

      await dispatch(convertBonusBalance({ amount })).unwrap();
      setConvertAmount("");
      showToast("Bonus converted to balance", { type: "success" });
      dispatch(fetchBonusConversionStatus());
    } catch (err) {
      showToast(String(err || "Failed to convert bonus"), { type: "error" });
    }
  };

  const eligible = bonusStatus?.eligible ?? false;
  const minDepositRequired = bonusStatus?.minDepositRequired ?? 300;
  const depositTotal = bonusStatus?.depositTotal ?? 0;
  const minBonusConversionAmount = bonusStatus?.minBonusConversionAmount ?? 0;
  const hasConvertedBefore = !!bonusStatus?.hasConvertedBefore;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Shop</h2>
            <div className="mt-1 text-sm text-gray-400">
              Balance: <span className="text-gray-100 font-semibold">${Number(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="mx-2 text-gray-600">|</span>
              Bonus: <span className="text-primary-200 font-semibold">${Number(bonusBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-3 bg-gray-800/60 border border-gray-700 rounded-lg p-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm">
                  <div className="text-gray-200 font-semibold">Bonus Balance Conversion</div>
                  <div className="text-gray-400">
                    {bonusStatusLoading
                      ? "Checking eligibility..."
                      : eligible
                      ? `You can convert your bonus to account balance${Number(minBonusConversionAmount) > 0 ? ` (min $${Number(minBonusConversionAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${hasConvertedBefore ? ' after first conversion' : ' for first conversion'})` : ""}`
                      : `Not eligible yet: deposit at least $${Number(minDepositRequired).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Deposits: $${Number(depositTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    placeholder="Amount (blank = all)"
                    className="w-44 px-3 py-2 rounded-lg bg-gray-900/40 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button
                    onClick={handleConvert}
                    isLoading={converting}
                    disabled={!eligible || Number(bonusBalance || 0) <= 0 || bonusStatusLoading}
                  >
                    Convert
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full md:w-80 px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button onClick={handleSearch}>Search</Button>
            <Button className="whitespace-nowrap" variant="outline" onClick={()=>window.location.assign('/login/shop/orders')}>My Orders</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading.products ? (
            <div className="col-span-full">
              <ComponentLoader type="card" message="Loading products..." />
            </div>
          ) : (
            products && products.length
              ? products.map((p)=> <ProductCard key={p._id||p.externalId} product={p} />)
              : <div className="col-span-full text-center text-gray-400">No products found</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
