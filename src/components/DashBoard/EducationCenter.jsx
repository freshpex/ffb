import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaBookOpen, 
  FaVideo, 
  FaTv, 
  FaFilter, 
  FaBookmark, 
  FaClock,
  FaCalendarAlt, 
  FaGraduationCap, 
  FaTimes, 
  FaArrowRight,
  FaChalkboardTeacher,
  FaTag
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import Button from "../common/Button";
import { 
  fetchResources, 
  setFilters,
  clearFilters,
  setActiveResource,
  toggleBookmark,
  selectResources,
  selectFeaturedResources,
  selectCourses,
  selectBookmarks,
  selectEducationStatus
} from "../../redux/slices/educationSlice";

const EducationCenter = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const resources = useSelector(selectResources);
  const featuredResources = useSelector(selectFeaturedResources);
  const courses = useSelector(selectCourses);
  const bookmarks = useSelector(selectBookmarks);
  const status = useSelector(selectEducationStatus);
  
  // Local state
  const [activeTab, setActiveTab] = useState("all"); // "all" | "courses" | "bookmarks"
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  
  // Load resources on component mount
  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);
  
  // Handle search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(setFilters({ search: searchQuery }));
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);
  
  const handleSetFilter = (type, value) => {
    dispatch(setFilters({ [type]: value }));
  };
  
  const handleClearFilters = () => {
    setSearchQuery("");
    dispatch(clearFilters());
  };
  
  const handleResourceClick = (resourceId) => {
    dispatch(setActiveResource(resourceId));
    setSelectedResourceId(resourceId);
  };
  
  const handleToggleBookmark = (resourceId, event) => {
    event.stopPropagation();
    dispatch(toggleBookmark(resourceId));
  };
  
  const closeResourceModal = () => {
    setSelectedResourceId(null);
  };
  
  const isBookmarked = (resourceId) => {
    return bookmarks.some(resource => resource.id === resourceId);
  };
  
  const getResourceIcon = (type) => {
    switch (type) {
      case 'article':
        return <FaBookOpen className="text-blue-400" />;
      case 'video':
        return <FaVideo className="text-red-400" />;
      case 'webinar':
        return <FaTv className="text-purple-400" />;
      default:
        return <FaBookOpen className="text-blue-400" />;
    }
  };
  
  // Get the selected resource
  const selectedResource = resources.find(r => r.id === selectedResourceId);
  
  // Render resource modal
  const renderResourceModal = () => {
    if (!selectedResource) return null;
    
    return (
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeResourceModal}
      >
        <motion.div 
          className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-gray-800 z-10">
            <div className="flex items-center">
              {getResourceIcon(selectedResource.type)}
              <h3 className="text-xl font-semibold text-white ml-2">{selectedResource.title}</h3>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => handleToggleBookmark(selectedResource.id, e)}
                className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
                  isBookmarked(selectedResource.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                }`}
                title={isBookmarked(selectedResource.id) ? "Remove Bookmark" : "Add Bookmark"}
              >
                <FaBookmark />
              </button>
              <button
                onClick={closeResourceModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-500/20 text-primary-400 flex items-center">
                <FaTag className="mr-1" /> {selectedResource.category}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center">
                {getResourceIcon(selectedResource.type)}
                <span className="ml-1">{selectedResource.type}</span>
              </span>
              {selectedResource.readTime && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center">
                  <FaClock className="mr-1" /> {selectedResource.readTime}
                </span>
              )}
              {selectedResource.duration && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center">
                  <FaClock className="mr-1" /> {selectedResource.duration}
                </span>
              )}
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center">
                <FaCalendarAlt className="mr-1" /> {new Date(selectedResource.date).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-gray-300 mb-6 text-base">{selectedResource.description}</p>
            
            {selectedResource.type === 'article' && (
              <div 
                className="prose prose-invert prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedResource.content }}
              />
            )}
            
            {(selectedResource.type === 'video' || selectedResource.type === 'webinar') && (
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <iframe
                  src={selectedResource.videoUrl}
                  title={selectedResource.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[400px] rounded"
                ></iframe>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  const renderFeaturedResources = () => {
    if (featuredResources.length === 0) return null;
    
    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredResources.slice(0, 3).map((resource) => (
            <motion.div
              key={resource.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg cursor-pointer group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleResourceClick(resource.id)}
            >
              <div className="h-40 bg-gray-700 relative overflow-hidden">
                {resource.image ? (
                  <img 
                    src={`https://source.unsplash.com/800x600/?${resource.image.split('.')[0]}`} 
                    alt={resource.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gray-600">
                    {getResourceIcon(resource.type)}
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2">
                  <button
                    onClick={(e) => handleToggleBookmark(resource.id, e)}
                    className={`p-2 rounded-full bg-gray-800/80 ${
                      isBookmarked(resource.id) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <FaBookmark />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-xs text-gray-400 mb-2">
                  <span className="flex items-center mr-3">
                    {getResourceIcon(resource.type)}
                    <span className="ml-1 capitalize">{resource.type}</span>
                  </span>
                  <span className="flex items-center">
                    <FaTag className="mr-1" />
                    <span className="capitalize">{resource.category}</span>
                  </span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{resource.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {new Date(resource.date).toLocaleDateString()}
                  </span>
                  {resource.readTime && (
                    <span className="flex items-center">
                      <FaClock className="mr-1" />
                      {resource.readTime}
                    </span>
                  )}
                  {resource.duration && (
                    <span className="flex items-center">
                      <FaClock className="mr-1" />
                      {resource.duration}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderCourseCard = (course) => (
    <motion.div
      key={course.id}
      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-primary-500 hover:shadow-lg cursor-pointer group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-40 bg-gray-700 relative overflow-hidden">
        <img 
          src={`https://source.unsplash.com/800x600/?${course.image.split('.')[0]},course`} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {course.enrollmentStatus === 'enrolled' && (
          <div className="absolute top-0 left-0 p-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
              Enrolled
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white">{course.instructor}</span>
            <span className="text-xs font-medium text-white">{course.duration}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-primary-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
        
        {course.enrollmentStatus === 'enrolled' && (
          <div className="mb-3">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 flex items-center">
            <FaTag className="mr-1" />
            <span className="capitalize">{course.category}</span>
          </span>
          <div>
            {course.enrollmentStatus === 'enrolled' ? (
              <Button size="xs">
                Continue Learning <FaArrowRight className="ml-1" />
              </Button>
            ) : (
              <Button size="xs" variant="outline">
                View Course <FaArrowRight className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  const renderResourceRow = (resource) => (
    <motion.div
      key={resource.id}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700/50 cursor-pointer transition-colors flex flex-col sm:flex-row gap-4 border border-gray-700"
      onClick={() => handleResourceClick(resource.id)}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-full sm:w-16 h-16 bg-gray-700 rounded text-3xl">
        {getResourceIcon(resource.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-white mb-1">{resource.title}</h3>
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{resource.description}</p>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center">
            <FaTag className="mr-1" />
            <span className="capitalize">{resource.category}</span>
          </span>
          <span className="flex items-center">
            <FaCalendarAlt className="mr-1" />
            {new Date(resource.date).toLocaleDateString()}
          </span>
          {resource.readTime && (
            <span className="flex items-center">
              <FaClock className="mr-1" />
              {resource.readTime}
            </span>
          )}
          {resource.duration && (
            <span className="flex items-center">
              <FaClock className="mr-1" />
              {resource.duration}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex items-start sm:items-center justify-end">
        <button
          onClick={(e) => handleToggleBookmark(resource.id, e)}
          className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
            isBookmarked(resource.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
          }`}
          title={isBookmarked(resource.id) ? "Remove Bookmark" : "Add Bookmark"}
        >
          <FaBookmark />
        </button>
      </div>
    </motion.div>
  );
  
  return (
    <DashboardLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
            <FaGraduationCap className="mr-3 text-primary-500" /> Education Center
          </h1>
          
          <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Resources
            </button>
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === "courses"
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              Courses
            </button>
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === "bookmarks"
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("bookmarks")}
            >
              Bookmarks
            </button>
          </div>
        </div>
        
        {/* Search and filter bar */}
        <div className="bg-gray-800 rounded-lg mb-8 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for educational resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            <div className="flex mt-3 flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="xs"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <FaFilter className="mr-1" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <Button 
                variant={activeTab === "all" ? "ghost" : "outline"}
                size="xs"
                onClick={() => handleSetFilter('type', null)}
                className="flex items-center"
              >
                All Types
              </Button>
              
              <Button 
                variant={activeTab === "all" && "article" ? "ghost" : "outline"}
                size="xs"
                onClick={() => handleSetFilter('type', 'article')}
                className="flex items-center"
              >
                <FaBookOpen className="mr-1" /> Articles
              </Button>
              
              <Button 
                variant={activeTab === "all" && "video" ? "ghost" : "outline"}
                size="xs"
                onClick={() => handleSetFilter('type', 'video')}
                className="flex items-center"
              >
                <FaVideo className="mr-1" /> Videos
              </Button>
              
              <Button 
                variant={activeTab === "all" && "webinar" ? "ghost" : "outline"}
                size="xs"
                onClick={() => handleSetFilter('type', 'webinar')}
                className="flex items-center"
              >
                <FaTv className="mr-1" /> Webinars
              </Button>
              
              {(searchQuery || showFilters) && (
                <Button 
                  variant="outline"
                  size="xs"
                  onClick={handleClearFilters}
                  className="ml-auto"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 border-t border-gray-700"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                        onChange={(e) => handleSetFilter('category', e.target.value === 'all' ? null : e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="trading">Trading</option>
                        <option value="investment">Investment</option>
                        <option value="crypto">Cryptocurrency</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Sort By</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                      >
                        <option value="date">Date (Newest First)</option>
                        <option value="title">Title (A-Z)</option>
                        <option value="popular">Popularity</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "all" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Featured resources */}
              {renderFeaturedResources()}
              
              {/* All resources */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">All Resources</h2>
                <div className="space-y-4">
                  {resources.length > 0 ? (
                    resources.map(resource => renderResourceRow(resource))
                  ) : (
                    <div className="bg-gray-800 p-8 rounded-lg text-center">
                      <div className="text-gray-400 text-5xl mb-3 flex justify-center">
                        <FaSearch />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No resources found</h3>
                      <p className="text-gray-400 mb-4">Try adjusting your search or filters.</p>
                      <Button variant="outline" onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === "courses" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaChalkboardTeacher className="mr-2 text-primary-500" /> Learning Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => renderCourseCard(course))}
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === "bookmarks" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaBookmark className="mr-2 text-primary-500" /> Your Bookmarks
                </h2>
                <div className="space-y-4">
                  {bookmarks.length > 0 ? (
                    bookmarks.map(resource => renderResourceRow(resource))
                  ) : (
                    <div className="bg-gray-800 p-8 rounded-lg text-center">
                      <div className="text-gray-400 text-5xl mb-3 flex justify-center">
                        <FaBookmark />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No bookmarks yet</h3>
                      <p className="text-gray-400 mb-4">Save resources for quick access by clicking the bookmark icon.</p>
                      <Button onClick={() => setActiveTab("all")}>
                        Browse Resources
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Resource detail modal */}
      <AnimatePresence>
        {selectedResourceId && renderResourceModal()}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default EducationCenter;
