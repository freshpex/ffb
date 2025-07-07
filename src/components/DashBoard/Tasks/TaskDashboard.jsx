import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTasks,
  FaCheck,
  FaStar,
  FaCoins,
  FaFilter,
  FaTimes,
  FaChartLine,
  FaArrowRight,
  FaRegClock,
  FaExclamationTriangle,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";
import DashboardLayout from "../Layout/DashboardLayout";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import Pagination from "../../common/Pagination";
import {
  fetchAvailableTasks,
  fetchUserTasks,
  fetchTaskStatistics,
  startTask,
  claimTaskReward,
  setCurrentPage,
  setTaskFilters,
  selectAllTasks,
  selectUserTasks,
  selectTaskStatistics,
  selectTaskFilters,
  selectTaskStatus,
  selectTaskError,
  selectTaskPagination,
  selectCompletableTasks,
} from "../../../redux/slices/taskSlice";
import TaskItem from "./TaskItem";
import TaskStats from "./TaskStats";
import CompletedTaskList from "./CompletedTaskList";

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectAllTasks);
  const userTasks = useSelector(selectUserTasks);
  const statistics = useSelector(selectTaskStatistics);
  const filters = useSelector(selectTaskFilters);
  const status = useSelector(selectTaskStatus);
  const error = useSelector(selectTaskError);
  const pagination = useSelector(selectTaskPagination);
  const completableTasks = useSelector(selectCompletableTasks);
  
  const [activeTab, setActiveTab] = useState("available");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch task data on component mount
  useEffect(() => {
    dispatch(fetchAvailableTasks());
    dispatch(fetchUserTasks());
    dispatch(fetchTaskStatistics());
  }, [dispatch]);

  // Hide alert after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Filter tasks based on search query and filters
  const filteredTasks = allTasks.filter((task) => {
    const matchesQuery =
      searchQuery.toLowerCase() === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filters.category === "all" || task.category === filters.category;

    const matchesDifficulty =
      filters.difficulty === "all" || task.difficulty === filters.difficulty;

    // For status filter, check userProgress
    const matchesStatus = filters.status === "all" 
      ? true 
      : task.userProgress 
        ? task.userProgress.status === filters.status
        : filters.status === "available";

    return matchesQuery && matchesCategory && matchesDifficulty && matchesStatus;
  });

  // Handler for starting a task
  const handleStartTask = (taskId) => {
    if (!taskId) {
      setAlertMessage({
        type: "error",
        message: "Task ID is missing. Please try again.",
      });
      setShowAlert(true);
      console.error("Attempted to start a task with no ID");
      return;
    }
    
    dispatch(startTask(taskId))
      .unwrap()
      .then(() => {
        setAlertMessage({
          type: "success",
          message: "Task started successfully!",
        });
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMessage({
          type: "error",
          message: `Failed to start task: ${error}`,
        });
        setShowAlert(true);
      });
  };

  // Handler for claiming a reward
  const handleClaimReward = (taskId) => {
    if (!taskId) {
      setAlertMessage({
        type: "error",
        message: "Task ID is missing. Please try again.",
      });
      setShowAlert(true);
      console.error("Attempted to claim reward for a task with no ID");
      return;
    }
    
    dispatch(claimTaskReward(taskId))
      .unwrap()
      .then((result) => {
        setAlertMessage({
          type: "success",
          message: `Reward of ${result.data.reward.amount} ${result.data.reward.type} claimed successfully!`,
        });
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMessage({
          type: "error",
          message: `Failed to claim reward: ${error}`,
        });
        setShowAlert(true);
      });
  };

  // Handler for filter changes
  const handleFilterChange = (filterType, value) => {
    dispatch(setTaskFilters({ [filterType]: value }));
  };

  // Handler for page changes
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchAvailableTasks({ page }));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    dispatch(setTaskFilters({
      category: "all",
      status: "all",
      difficulty: "all"
    }));
  };

  // Refresh tasks
  const refreshTasks = () => {
    dispatch(fetchAvailableTasks());
    dispatch(fetchUserTasks());
    dispatch(fetchTaskStatistics());
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    if (!category) return "";
    return category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
  };

  // Render task tabs
  const renderTabs = () => (
    <div className="mb-6">
      <div className="flex border-b border-gray-700">
        <button
          className={`py-3 px-6 ${
            activeTab === "available"
              ? "text-blue-500 border-b-2 border-blue-500 font-medium"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Available Tasks
        </button>
        <button
          className={`py-3 px-6 ${
            activeTab === "inProgress"
              ? "text-blue-500 border-b-2 border-blue-500 font-medium"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("inProgress")}
        >
          In Progress
        </button>
        <button
          className={`py-3 px-6 ${
            activeTab === "completed"
              ? "text-blue-500 border-b-2 border-blue-500 font-medium"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
        <button
          className={`py-3 px-6 ${
            activeTab === "statistics"
              ? "text-blue-500 border-b-2 border-blue-500 font-medium"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("statistics")}
        >
          Statistics
        </button>
      </div>
    </div>
  );

  // Render available tasks tab
  const renderAvailableTasks = () => (
    <div>
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
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

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" />{" "}
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTasks}
              >
                <FaSyncAlt className="mr-2" /> Refresh
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200"
                    >
                      <option value="all">All Categories</option>
                      <option value="order">Orders</option>
                      <option value="combo">Combos</option>
                      <option value="deposit">Deposits</option>
                      <option value="trading">Trading</option>
                      <option value="kyc">KYC</option>
                      <option value="referral">Referral</option>
                      <option value="social">Social</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={filters.difficulty}
                      onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200"
                    >
                      <option value="all">All Statuses</option>
                      <option value="available">Available</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="claimed">Claimed</option>
                    </select>
                  </div>

                  <div className="flex items-end md:col-span-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      fullWidth
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="divide-y divide-gray-700">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem 
                key={task._id || task.id || `task-${Math.random()}`}
                task={task}
                onStart={handleStartTask}
                onClaim={handleClaimReward}
              />
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              <div className="flex flex-col items-center">
                <FaTasks className="text-4xl mb-4 text-gray-500" />
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm mt-1">
                  {searchQuery || filters.category !== "all" || filters.difficulty !== "all" || filters.status !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Check back later for new tasks"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );

  // Render in-progress tasks tab
  const renderInProgressTasks = () => {
    const inProgressTasks = userTasks.filter(task => task.status === "in_progress");
    
    return (
      <div>
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Tasks in Progress</h3>
              <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                {inProgressTasks.length} Active
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map((userTask) => {
                const task = allTasks.find(t => t.id === userTask.task);
                return task ? (
                  <TaskItem 
                    key={userTask._id || userTask.id || `usertask-${Math.random()}`}
                    task={{...task, userProgress: userTask}}
                    onStart={handleStartTask}
                    onClaim={handleClaimReward}
                  />
                ) : null;
              })
            ) : (
              <div className="px-6 py-12 text-center text-gray-400">
                <div className="flex flex-col items-center">
                  <FaRegClock className="text-4xl mb-4 text-gray-500" />
                  <p className="text-lg font-medium">No tasks in progress</p>
                  <p className="text-sm mt-1">
                    Start a task from the Available Tasks tab
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render completed tasks tab
  const renderCompletedTasks = () => (
    <CompletedTaskList 
      userTasks={userTasks.filter(task => 
        task.status === "completed" || task.status === "claimed"
      )}
      allTasks={allTasks}
      onClaimReward={handleClaimReward}
    />
  );

  // Render statistics tab
  const renderStatisticsTab = () => (
    <TaskStats statistics={statistics} />
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Task-Based Earnings
            </h1>
            <p className="text-gray-400">
              Complete tasks to earn rewards and boost your trading capital
            </p>
          </div>
          <div className="flex gap-3">
            {completableTasks.length > 0 && (
              <Button 
                variant="success" 
                onClick={() => {
                  setActiveTab("completed");
                }}
              >
                <FaCoins className="mr-2" /> 
                {completableTasks.length} Rewards to Claim
              </Button>
            )}
            <Button variant="primary" onClick={() => setActiveTab("available")}>
              <FaTasks className="mr-2" /> Browse Tasks
            </Button>
          </div>
        </div>

        {showAlert && (
          <Alert
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={() => setShowAlert(false)}
            className="mb-6"
          />
        )}

        {status === "failed" && (
          <Alert
            type="error"
            message={error || "Failed to load task data. Please try again."}
            className="mb-6"
          />
        )}

        {/* Task stats summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-400">Available Tasks</div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <FaTasks size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {allTasks.length}
            </div>
            <div className="mt-2 text-sm text-blue-400">
              {userTasks.filter(task => task.status === "in_progress").length} in progress
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-400">Completed Tasks</div>
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <FaCheck size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {userTasks.filter(task => task.status === "completed" || task.status === "claimed").length}
            </div>
            <div className="mt-2 text-sm text-green-400">
              {completableTasks.length} rewards ready to claim
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-400">Total Earnings</div>
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                <FaCoins size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              ${statistics.totalEarnings.toFixed(2)}
            </div>
            <div className="mt-2 text-sm text-yellow-400">
              From completed tasks
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-400">Completion Rate</div>
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <FaChartLine size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {statistics.completionRate}%
            </div>
            <div className="mt-2 text-sm text-purple-400">
              Task success rate
            </div>
          </div>
        </div>

        {/* Show tabs for navigation */}
        {renderTabs()}

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "available" && renderAvailableTasks()}
            {activeTab === "inProgress" && renderInProgressTasks()}
            {activeTab === "completed" && renderCompletedTasks()}
            {activeTab === "statistics" && renderStatisticsTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default TaskDashboard;
