import { useState } from "react";
import { adminService } from "../../services/apiService";
import Button from "../common/Button";

const AdminEducationImporter = () => {
  const [playlistId, setPlaylistId] = useState("");
  const [category, setCategory] = useState("beginner");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        playlistId,
        category,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      };
      const res = await adminService.syncYoutubePlaylist(payload);
      setResult(res.data);
      if (res.data && res.data.importId) {
        const job = await adminService.getImportById(res.data.importId);
        setResult({ queued: res.data, job: job.data });
      }
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        YouTube Playlist Importer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Playlist ID
          </label>
          <input
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            placeholder="PL... or playlist ID"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="market-analysis">Market Analysis</option>
            <option value="trading-strategies">Trading Strategies</option>
            <option value="risk-management">Risk Management</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Tags (comma separated)
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="trading,crypto"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          />
        </div>

        <div>
          <Button type="submit" disabled={loading || !playlistId}>
            {loading ? "Importing..." : "Import Playlist"}
          </Button>
        </div>
      </form>

      {result && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <pre className="text-sm text-gray-200 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminEducationImporter;
