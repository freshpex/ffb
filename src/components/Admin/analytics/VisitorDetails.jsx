import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
    fetchAllVisitors, 
    fetchVisitorDetails,
    resetSelectedVisitor,
    selectVisitors,
    selectVisitorsPagination,
    selectVisitorsStatus,
    selectVisitorsError,
    selectSelectedVisitor,
    selectSelectedVisitorStatus
} from "../../../redux/slices/visitorAnalyticsSlice";
import { 
    ChevronLeftIcon, 
    ChevronRightIcon,
    ChevronUpIcon, 
    ChevronDownIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/solid';

const VisitorDetails = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('lastVisit');
    const [sortOrder, setSortOrder] = useState('desc');

    const visitors = useSelector(selectVisitors);
    const pagination = useSelector(selectVisitorsPagination);
    const status = useSelector(selectVisitorsStatus);
    const error = useSelector(selectVisitorsError);
    const selectedVisitor = useSelector(selectSelectedVisitor);
    const selectedVisitorStatus = useSelector(selectSelectedVisitorStatus);

    useEffect(() => {
        loadVisitors();
    }, [currentPage, pageSize, sortField, sortOrder, dispatch]);

    const loadVisitors = () => {
        dispatch(fetchAllVisitors({
            page: currentPage,
            limit: pageSize,
            sort: sortField,
            order: sortOrder
        }));
    };

    const handleViewDetails = (visitorId) => {
        dispatch(fetchVisitorDetails(visitorId));
        setIsModalOpen(true);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleCloseModal = () => {
        dispatch(resetSelectedVisitor());
        setIsModalOpen(false);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    };

    // Get device icon based on type
    const getDeviceIcon = (deviceType) => {
        switch(deviceType) {
            case 'mobile': return '📱';
            case 'tablet': return '📱';
            case 'desktop': return '💻';
            default: return '🖥️';
        }
    };

    // Pagination component
    const Pagination = () => (
        <div className="flex flex-wrap justify-between items-center my-4">
            <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                    Showing {visitors.length} of {pagination.total} visitors
                </p>
                <select 
                    className="mt-1 block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    value={pageSize} 
                    onChange={handlePageSizeChange}
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>
            
            <div className="flex items-center">
                <button
                    className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="mx-2">
                    Page {currentPage} of {pagination.pages || 1}
                </span>
                <button
                    className={`p-2 rounded-md ${currentPage === pagination.pages || pagination.pages === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages || pagination.pages === 0}
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );

    // Mobile view - card layout
    const VisitorCards = () => (
        <div className="space-y-4">
            {visitors.map(visitor => (
                <div key={visitor._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                        <div className="grid grid-cols-4 gap-3">
                            <div className="col-span-1">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                        {visitor.locationInfo?.countryCode ? (
                                            <img 
                                                src={`https://flagcdn.com/48x36/${visitor.locationInfo.countryCode.toLowerCase()}.png`}
                                                alt={visitor.locationInfo?.country || "Unknown country"}
                                                className="w-full h-auto"
                                            />
                                        ) : (
                                            <span className="text-gray-500 text-xl">?</span>
                                        )}
                                    </div>
                                    <span className={`mt-2 px-2 py-1 text-xs font-medium rounded-full ${visitor.convertedToUser ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {visitor.convertedToUser ? "User" : "Visitor"}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <p className="font-bold text-gray-900 truncate">
                                    ID: {visitor.visitorId.substring(0, 8)}...
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {getDeviceIcon(visitor.browserInfo?.deviceType)} {visitor.browserInfo?.browser} on {visitor.browserInfo?.os}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    📍 {visitor.locationInfo?.city || "Unknown"}, {visitor.locationInfo?.country || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Last visit: {formatDate(visitor.lastVisit)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Visits: {visitor.totalVisits}
                                </p>
                                <button 
                                    className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => handleViewDetails(visitor._id)}
                                >
                                    Details
                                    <InformationCircleIcon className="ml-1.5 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Desktop view - table layout
    const VisitorTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('visitorId')}>
                            <div className="flex items-center">
                                Visitor ID
                                {sortField === 'visitorId' && (
                                    sortOrder === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Device
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('locationInfo.country')}>
                            <div className="flex items-center">
                                Location
                                {sortField === 'locationInfo.country' && (
                                    sortOrder === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lastVisit')}>
                            <div className="flex items-center">
                                Last Visit
                                {sortField === 'lastVisit' && (
                                    sortOrder === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalVisits')}>
                            <div className="flex items-center">
                                Visits
                                {sortField === 'totalVisits' && (
                                    sortOrder === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('convertedToUser')}>
                            <div className="flex items-center">
                                Status
                                {sortField === 'convertedToUser' && (
                                    sortOrder === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {visitors.map(visitor => (
                        <tr key={visitor._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span title={visitor.visitorId}>{visitor.visitorId.substring(0, 10)}...</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <span className="mr-2">{getDeviceIcon(visitor.browserInfo?.deviceType)}</span>
                                    <span className="text-sm text-gray-500">{visitor.browserInfo?.browser} on {visitor.browserInfo?.os}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {visitor.locationInfo?.countryCode && (
                                        <img 
                                            className="h-5 w-auto mr-2" 
                                            src={`https://flagcdn.com/48x36/${visitor.locationInfo.countryCode.toLowerCase()}.png`}
                                            alt={visitor.locationInfo?.country || "Unknown country"}
                                        />
                                    )}
                                    <span className="text-sm text-gray-900">{visitor.locationInfo?.city || "Unknown"}, {visitor.locationInfo?.country || "Unknown"}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(visitor.lastVisit)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {visitor.totalVisits}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${visitor.convertedToUser ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {visitor.convertedToUser ? "User" : "Visitor"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleViewDetails(visitor._id)}
                                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                >
                                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Visitor Analytics</h1>
                    <button 
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${status === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}`}
                        onClick={loadVisitors}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Refreshing...
                            </>
                        ) : "Refresh Data"}
                    </button>
                </div>
                
                {status === 'failed' && (
                    <div className="rounded-md bg-red-50 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error || 'Failed to load visitors. Please try again.'}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {status === 'loading' && visitors.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : visitors.length > 0 ? (
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="hidden md:block">{<VisitorTable />}</div>
                        <div className="md:hidden">{<VisitorCards />}</div>
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                            <Pagination />
                        </div>
                    </div>
                ) : status === 'succeeded' ? (
                    <div className="rounded-md bg-blue-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">No visitors found.</p>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Visitor Details</h3>
                                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                            
                                            {selectedVisitorStatus === 'loading' && (
                                                <div className="flex justify-center items-center py-12">
                                                    <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                            
                                            {selectedVisitorStatus === 'succeeded' && selectedVisitor && (
                                                <div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Basic Information</h4>
                                                            <dl className="grid grid-cols-2 gap-y-2">
                                                                <dt className="text-sm font-medium text-gray-500">Visitor ID:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.visitorId}</dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">First Visit:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{formatDate(selectedVisitor.firstVisit)}</dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">Last Visit:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{formatDate(selectedVisitor.lastVisit)}</dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">Total Visits:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.totalVisits}</dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">Status:</dt>
                                                                <dd className="text-right">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedVisitor.convertedToUser ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                                        {selectedVisitor.convertedToUser ? "User" : "Visitor"}
                                                                    </span>
                                                                </dd>
                                                            </dl>
                                                        </div>
                                                        
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Device Information</h4>
                                                            <dl className="grid grid-cols-2 gap-y-2">
                                                                <dt className="text-sm font-medium text-gray-500">Device Type:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.browserInfo?.deviceType || "Unknown"}</dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">Browser:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.browserInfo?.browser || "Unknown"}</dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">OS:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.browserInfo?.os || "Unknown"}</dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">Screen Size:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">
                                                                    {selectedVisitor.browserInfo?.screenWidth || "?"} x {selectedVisitor.browserInfo?.screenHeight || "?"}
                                                                </dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">Platform:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.browserInfo?.platform || "Unknown"}</dd>
                                                            </dl>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Location Information</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <dl className="grid grid-cols-2 gap-y-2">
                                                                <dt className="text-sm font-medium text-gray-500">Country:</dt>
                                                                <dd className="text-sm text-gray-900 text-right flex items-center justify-end">
                                                                    {selectedVisitor.locationInfo?.countryCode && (
                                                                        <img 
                                                                            className="h-4 w-auto mr-2" 
                                                                            src={`https://flagcdn.com/48x36/${selectedVisitor.locationInfo.countryCode.toLowerCase()}.png`}
                                                                            alt={selectedVisitor.locationInfo?.country || "Unknown country"}
                                                                        />
                                                                    )}
                                                                    {selectedVisitor.locationInfo?.country || "Unknown"}
                                                                </dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">City:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.locationInfo?.city || "Unknown"}</dd>
                                                            </dl>
                                                            
                                                            <dl className="grid grid-cols-2 gap-y-2">
                                                                <dt className="text-sm font-medium text-gray-500">Region:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.locationInfo?.region || "Unknown"}</dd>
                                                                
                                                                <dt className="text-sm font-medium text-gray-500">IP Address:</dt>
                                                                <dd className="text-sm text-gray-900 text-right">{selectedVisitor.locationInfo?.ip || "Unknown"}</dd>
                                                            </dl>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-6">
                                                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Visit History</h4>
                                                        {selectedVisitor.visits && selectedVisitor.visits.length > 0 ? (
                                                            <div className="mt-2 overflow-x-auto">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                                        {selectedVisitor.visits.map((visit, index) => (
                                                                            <tr key={index} className="hover:bg-gray-50">
                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(visit.timestamp)}</td>
                                                                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{visit.path}</td>
                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.duration ? `${Math.round(visit.duration / 1000)}s` : 'N/A'}</td>
                                                                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{visit.referrer || 'Direct'}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No visit history available.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisitorDetails;
