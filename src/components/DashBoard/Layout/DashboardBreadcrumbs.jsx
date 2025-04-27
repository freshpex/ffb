import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";

// Navigation item groups with nested routes for breadcrumb lookup
const navigationGroups = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/login/dashboardpage",
      },
      {
        id: "invest",
        label: "Invest",
        path: "/login/investmentplans",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        id: "deposit",
        label: "Deposit",
        path: "/login/deposit",
      },
      {
        id: "withdraw",
        label: "Withdraw",
        path: "/login/withdraw",
      },
      {
        id: "cards",
        label: "Cards",
        path: "/login/cards",
      },
    ],
  },
  {
    id: "trading",
    label: "Trading",
    items: [
      {
        id: "trading",
        label: "Trading Terminal",
        path: "/login/trading",
      },
      {
        id: "tradingplatform",
        label: "Advanced Platform",
        path: "/login/tradingplatform",
      },
    ],
  },
  {
    id: "other",
    label: "Other",
    items: [
      {
        id: "education",
        label: "Education",
        path: "/login/education",
      },
      {
        id: "referral",
        label: "Refer & Earn",
        path: "/login/referral",
      },
      {
        id: "account",
        label: "Account Settings",
        path: "/login/accountsettings",
      },
    ],
  },
];

const DashboardBreadcrumbs = () => {
  const location = useLocation();

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: "Home", path: "/login/dashboardpage" }];

    // Flatten all navigation items
    const allItems = navigationGroups.flatMap((group) => group.items);

    // Find the current page
    const currentPage = allItems.find(
      (item) => item.path === location.pathname,
    );

    if (currentPage && currentPage.path !== "/login/dashboardpage") {
      breadcrumbs.push({ label: currentPage.label, path: currentPage.path });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex items-center text-sm">
      {breadcrumbs.map((crumb, index, array) => (
        <div key={crumb.path} className="flex items-center">
          <Link
            to={crumb.path}
            className={
              index === array.length - 1
                ? "text-white font-medium"
                : "text-gray-400 hover:text-white"
            }
          >
            {index === 0 ? <FaHome className="mr-1" /> : null}
            {crumb.label}
          </Link>

          {index < array.length - 1 && (
            <span className="mx-2 text-gray-600">/</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardBreadcrumbs;
