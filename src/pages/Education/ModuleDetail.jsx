import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { educationService } from "../../services/apiService";
import DashboardLayout from "../../components/DashBoard/Layout/DashboardLayout";

const ModuleDetail = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await educationService.getById(id);
        if (!mounted) return;
        const data = res.data || res.data?.data || res.data;
        setModule(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!module) return <div className="p-6">Module not found</div>;

  // Make embeddable YouTube URL
  const embedUrl = module.videoUrl
    ? module.videoUrl.includes("youtube.com")
      ? module.videoUrl.replace("watch?v=", "embed/")
      : module.videoUrl
    : null;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-white mb-4">
          {module.title}
        </h1>
        <div className="mb-4 text-gray-300">{module.description}</div>

        {embedUrl ? (
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <iframe
              src={embedUrl}
              title={module.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-[500px] rounded"
            />
          </div>
        ) : (
          <div className="bg-gray-800 rounded p-6">No video available</div>
        )}

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: module.content || module.description,
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default ModuleDetail;
