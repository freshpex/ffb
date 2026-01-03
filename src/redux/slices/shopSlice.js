import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { shopService } from "../../services/apiService";

// Async thunks
export const searchProducts = createAsyncThunk(
  "shop/searchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await shopService.searchProducts(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search products",
      );
    }
  },
);

export const getCachedProducts = createAsyncThunk(
  "shop/getCachedProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await shopService.getCachedProducts(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get products",
      );
    }
  },
);

export const getProductById = createAsyncThunk(
  "shop/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await shopService.getProductById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get product",
      );
    }
  },
);

export const getTrendingProducts = createAsyncThunk(
  "shop/getTrendingProducts",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await shopService.getTrending(limit);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get trending products",
      );
    }
  },
);

export const fetchCart = createAsyncThunk(
  "shop/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await shopService.getCart();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

export const addToCart = createAsyncThunk(
  "shop/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await shopService.addToCart({ productId, quantity });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart",
      );
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "shop/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await shopService.updateCartItem({
        productId,
        quantity,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart",
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "shop/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await shopService.removeFromCart(productId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from cart",
      );
    }
  },
);

export const clearCart = createAsyncThunk(
  "shop/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await shopService.clearCart();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart",
      );
    }
  },
);

export const createOrder = createAsyncThunk(
  "shop/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {const addr = orderData?.shippingAddress;
      if (!addr || !addr.fullName || !addr.addressLine1 || !addr.city || !addr.country) {
        return rejectWithValue("Complete shipping address is required");
      }

      const response = await shopService.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create order",
      );
    }
  },
);

export const fetchOrders = createAsyncThunk(
  "shop/fetchOrders",
  async (params, { rejectWithValue }) => {
    try {
      const response = await shopService.getOrders(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  "shop/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await shopService.getOrderById(orderId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order",
      );
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "shop/cancelOrder",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await shopService.cancelOrder(orderId, reason);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order",
      );
    }
  },
);

const initialState = {
  products: [],
  trendingProducts: [],
  currentProduct: null,
  cart: {
    items: [],
    summary: {
      itemCount: 0,
      subtotal: 0,
      shippingFee: 0,
      tax: 0,
      total: 0,
      potentialReward: 0,
    },
  },
  orders: [],
  currentOrder: null,
  loading: {
    products: false,
    cart: false,
    orders: false,
  },
  error: {
    products: null,
    cart: null,
    orders: null,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    category: "all",
    search: "",
    minPrice: null,
    maxPrice: null,
    sortBy: "BEST_MATCH",
  },
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearProductError: (state) => {
      state.error.products = null;
    },
    clearCartError: (state) => {
      state.error.cart = null;
    },
    clearOrderError: (state) => {
      state.error.orders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = action.payload.products || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          total: action.payload.total || 0,
          totalPages: Math.ceil(
            (action.payload.total || 0) / (action.payload.limit || 20),
          ),
        };
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.payload;
      })

      // Get cached products
      .addCase(getCachedProducts.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(getCachedProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = action.payload.products || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(getCachedProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.payload;
      })

      // Get product by ID
      .addCase(getProductById.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading.products = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.payload;
      })

      // Get trending products
      .addCase(getTrendingProducts.fulfilled, (state, action) => {
        state.trendingProducts = action.payload;
      })

      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading.cart = true;
        state.error.cart = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading.cart = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading.cart = false;
        state.error.cart = action.payload;
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading.cart = true;
        state.error.cart = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading.cart = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading.cart = false;
        state.error.cart = action.payload;
      })

      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      // Clear cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.currentOrder = action.payload.data.order;
        // Clear cart after successful order
        state.cart = initialState.cart;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      })

      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      })

      // Fetch order by ID
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })

      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
        // Update order in list
        const index = state.orders.findIndex(
          (o) => o._id === action.payload.order._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearProductError,
  clearCartError,
  clearOrderError,
} = shopSlice.actions;

export default shopSlice.reducer;
