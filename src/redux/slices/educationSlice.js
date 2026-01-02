import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService, { educationService } from "../../services/apiService";

function normalizeFallbackResources(fallbackResponse) {
  const data = fallbackResponse?.data;
  const resources =
    data?.data?.resources || data?.resources || data?.data || data;

  return Array.isArray(resources) ? resources : [];
}

function applyLocalFilters(items, params = {}) {
  let filtered = Array.isArray(items) ? items : [];
  const search = params.search
    ? String(params.search).trim().toLowerCase()
    : "";
  const category = params.category ? String(params.category).trim() : "";

  if (category) {
    filtered = filtered.filter((r) => String(r.category || "") === category);
  }

  if (search) {
    filtered = filtered.filter((r) => {
      const title = String(r.title || "").toLowerCase();
      const desc = String(r.description || "").toLowerCase();
      return title.includes(search) || desc.includes(search);
    });
  }

  return filtered;
}

export const fetchResources = createAsyncThunk(
  "education/fetchResources",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await educationService.getResources(params);
      const content = res?.data?.data?.content;
      if (Array.isArray(content) && content.length > 0) {
        return {
          items: content,
          pagination: res.data.data.pagination || null,
          source: "db",
        };
      }

      // Fallback mock endpoint when DB is empty
      const fallback = await apiService.get("/education/resources");
      const items = applyLocalFilters(
        normalizeFallbackResources(fallback),
        params,
      );
      return { items, pagination: null, source: "fallback" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load resources",
      );
    }
  },
);

export const fetchFeatured = createAsyncThunk(
  "education/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const res = await educationService.getFeatured();
      const items = res?.data?.data || res?.data || [];
      return Array.isArray(items) ? items : [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load featured",
      );
    }
  },
);

function toYoutubeEmbedUrl(url) {
  if (!url) return null;
  const u = String(url);

  // Already an embed URL
  if (u.includes("youtube.com/embed/")) return u;

  // https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = u.match(/[?&]v=([^&]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // https://youtu.be/VIDEO_ID
  const shortMatch = u.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return u;
}

const initialState = {
  resources: [],
  featured: [],
  courses: [],
  bookmarks: [],
  filters: { search: null, type: null, category: null },
  activeResource: null,
  pagination: null,
  status: "idle",
  error: null,
  source: null,
};

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = { search: null, type: null, category: null };
    },
    setActiveResource(state, action) {
      state.activeResource = action.payload;
    },
    toggleBookmark(state, action) {
      const id = action.payload;
      if (state.bookmarks.some((b) => b.id === id)) {
        state.bookmarks = state.bookmarks.filter((b) => b.id !== id);
      } else {
        const r = state.resources.find((res) => res.id === id);
        if (r) state.bookmarks.push(r);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.source = action.payload?.source || null;
        const items = Array.isArray(action.payload?.items)
          ? action.payload.items
          : [];

        state.resources = items.map((item) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.description,
          content: item.content,
          category: item.category,
          type: item.videoUrl ? "video" : "article",
          videoUrl: item.videoUrl ? toYoutubeEmbedUrl(item.videoUrl) : null,
          thumbnailUrl: item.thumbnailUrl,
          image: item.thumbnailUrl || item.image || null,
          readTime: item.readTime,
          duration: item.durationSeconds
            ? formatDuration(item.durationSeconds)
            : item.duration || null,
          date: item.createdAt || item.updatedAt || item.date,
        }));

        // Basic featured set (backend "featured" is optional and often empty)
        state.featured = state.resources.slice(0, 3);

        state.pagination = action.payload?.pagination || null;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featured = (action.payload || []).map((item) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.description,
          image: item.thumbnailUrl,
          videoUrl: item.videoUrl ? toYoutubeEmbedUrl(item.videoUrl) : null,
          category: item.category,
          readTime: item.readTime,
          duration: item.durationSeconds
            ? formatDuration(item.durationSeconds)
            : item.duration || null,
          date: item.createdAt || item.updatedAt || item.date,
        }));
      });
  },
});

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return null;
  const s = Number(seconds);
  if (Number.isNaN(s)) return null;
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}m ${secs}s`;
}

export const { setFilters, clearFilters, setActiveResource, toggleBookmark } =
  educationSlice.actions;

export const selectResources = (state) => {
  const items = Array.isArray(state.education.resources)
    ? state.education.resources
    : [];
  const filters = state.education.filters || {};
  const search = filters.search
    ? String(filters.search).trim().toLowerCase()
    : "";
  const category = filters.category ? String(filters.category) : "";
  const type = filters.type ? String(filters.type) : "";

  return items.filter((r) => {
    if (category && String(r.category || "") !== category) return false;
    if (type && String(r.type || "") !== type) return false;

    if (search) {
      const title = String(r.title || "").toLowerCase();
      const desc = String(r.description || "").toLowerCase();
      if (!title.includes(search) && !desc.includes(search)) return false;
    }

    return true;
  });
};
export const selectFeaturedResources = (state) => state.education.featured;
export const selectCourses = (state) => state.education.courses;
export const selectBookmarks = (state) => state.education.bookmarks;
export const selectEducationStatus = (state) => state.education.status;
export const selectEducationFilters = (state) => state.education.filters;
export const selectEducationPagination = (state) => state.education.pagination;
export const selectEducationSource = (state) => state.education.source;

export default educationSlice.reducer;
