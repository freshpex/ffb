import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/Shop/ProductCard";
import ComponentLoader from "../../components/common/ComponentLoader";
import { getCachedProducts, searchProducts } from "../../redux/slices/shopSlice";
import Button from "../../components/common/Button";
import DashboardLayout from "../../components/DashBoard/Layout/DashboardLayout";

export default function ShopList(){
  const dispatch = useDispatch();
  const { products, loading, pagination, filters } = useSelector((s)=>s.shop || {});
  const [query, setQuery] = useState("");

  useEffect(()=>{
    dispatch(getCachedProducts({ page:1, limit:20 }));
  },[]);

  const handleSearch = ()=>{
    dispatch(searchProducts({ query, page:1, limit:20 }));
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Shop</h2>
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
