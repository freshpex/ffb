import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUser, 
  FaTag, 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaInfoCircle, 
  FaCheckCircle,
  FaTimesCircle,
  FaPaperPlane,
  FaPaperclip,
  FaExclamationTriangle,
  FaComment,
  FaLock
} from 'react-icons/fa';
import { 
  fetchSupportTicketById, 
  addSupportTicketReply, 
  updateSupportTicket,
  selectSelectedTicket, 
  selectSupportStatus, 
  selectSupportActionStatus 
} from '../../redux/slices/adminSupportSlice';
import { useDarkMode } from '../../context/DarkModeContext';
import PageTransition from '../common/PageTransition';
import ComponentLoader from '../common/ComponentLoader';
import StatusBadge from './common/StatusBadge';

const SupportTicketDetail = () => {
  const { ticketId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useDarkMode();
  const replyInputRef = useRef(null);
  
  const ticket = useSelector(selectSelectedTicket);
  const status = useSelector(selectSupportStatus);
  const actionStatus = useSelector(selectSupportActionStatus);
  
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  
  // Check if there is an action parameter in the URL
  const actionParam = searchParams.get('action');
  
  useEffect(() => {
    document.title = "Support Ticket | Admin Dashboard";
    dispatch(fetchSupportTicketById(ticketId));
    
    if (actionParam === 'respond' && replyInputRef.current) {
      replyInputRef.current.focus();
    } else if (actionParam === 'resolve') {
      setShowResolveModal(true);
    }
  }, [dispatch, ticketId, actionParam]);
  
  const handleAddReply = async () => {
    if (!replyContent.trim()) {
      alert('Please enter a reply before submitting');
      return;
    }
    
    try {
      await dispatch(addSupportTicketReply({ 
        id: ticketId, 
        message: replyContent
      })).unwrap();
      
      setReplyContent('');
      setAttachments([]);
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };
  
  const handleResolveTicket = async () => {
    try {
      await dispatch(updateSupportTicket({ 
        id: ticketId, 
        updates: {
          status: 'resolved',
          notes: resolutionNote
        }
      })).unwrap();
      
      setShowResolveModal(false);
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
    }
  };
  
  const handleCloseTicket = async () => {
    try {
      await dispatch(updateSupportTicket({ 
        id: ticketId, 
        updates: {
          status: 'closed'
        }
      })).unwrap();
    } catch (error) {
      console.error("Failed to close ticket:", error);
    }
  };
  
  const handleReopenTicket = async () => {
    try {
      await dispatch(updateSupportTicket({ 
        id: ticketId, 
        updates: {
          status: 'open'
        }
      })).unwrap();
    } catch (error) {
      console.error("Failed to reopen ticket:", error);
    }
  };
  
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };
  
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString();
  };
  
  // Get priority color class
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return {
          bg: darkMode ? 'bg-red-900/30' : 'bg-red-100',
          text: 'text-red-600 dark:text-red-400'
        };
      case 'high':
        return {
          bg: darkMode ? 'bg-orange-900/30' : 'bg-orange-100',
          text: 'text-orange-600 dark:text-orange-400'
        };
      case 'medium':
        return {
          bg: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100',
          text: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'low':
      default:
        return {
          bg: darkMode ? 'bg-green-900/30' : 'bg-green-100',
          text: 'text-green-600 dark:text-green-400'
        };
    }
  };
  
  if (status === 'loading') {
    return <ComponentLoader height="500px" message="Loading ticket details..." />;
  }
  
  if (!ticket) {
    return (
      <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <FaExclamationTriangle className={`mx-auto h-12 w-12 mb-4 ${darkMode ? 'text-yellow-500' : 'text-yellow-400'}`} />
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ticket not found</h3>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>The support ticket you are looking for does not exist or was removed.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/admin/support')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            <FaArrowLeft className="mr-2" /> Back to Support Tickets
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Support Ticket #{ticket.ticketNumber}
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              View and respond to customer support inquiries
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/admin/support')}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaArrowLeft className="mr-2" /> Back to Tickets
            </button>
          </div>
        </div>
        
        {/* Ticket Header */}
        <div className={`mb-6 rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        }`}>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {ticket.subject}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <StatusBadge status={ticket.status} />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority).bg} ${getPriorityColor(ticket.priority).text}`}>
                    Priority: {ticket.priority}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <FaTag className="mr-1 h-3 w-3" /> {ticket.category}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(ticket.status === 'open' || ticket.status === 'in_progress') && (
                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                  >
                    <FaCheckCircle className="inline mr-1" /> Resolve Ticket
                  </button>
                )}
                {ticket.status === 'open' && (
                  <button
                    onClick={async () => {
                      try {
                        await dispatch(updateSupportTicket({ 
                          ticketId, 
                          status: 'in_progress'
                        })).unwrap();
                      } catch (error) {
                        console.error("Failed to update ticket status:", error);
                      }
                    }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      darkMode 
                        ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <FaComment className="inline mr-1" /> Mark In Progress
                  </button>
                )}
                {ticket.status === 'resolved' && (
                  <button
                    onClick={handleCloseTicket}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <FaLock className="inline mr-1" /> Close Ticket
                  </button>
                )}
                {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                  <button
                    onClick={handleReopenTicket}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      darkMode 
                        ? 'bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                  >
                    Reopen Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <FaUser className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {ticket.user.fullName}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {ticket.user.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <FaCalendarAlt className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Created on {formatDate(ticket.createdAt)} at {formatTime(ticket.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Conversation */}
        <div className={`mb-6 rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        }`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Conversation
            </h3>
          </div>
          
          <div className="p-6 divide-y divide-gray-200 dark:divide-gray-700">
            {/* Initial Message */}
            <div className="pb-6">
              <div className="flex">
                <div className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <FaUser className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {ticket.user.fullName}
                      </span>
                      <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(ticket.createdAt)} {formatTime(ticket.createdAt)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Initial Request
                    </span>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {ticket.message}
                    </p>
                    
                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Attachments:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ticket.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs px-3 py-1 rounded-full inline-flex items-center ${
                                darkMode 
                                  ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              <FaPaperclip className="mr-1" /> {attachment.filename}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Replies */}
            {ticket.conversation && ticket.conversation.map((message, index) => (
              <div key={index} className="py-6">
                <div className="flex">
                  <div className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${
                    message.isAdmin 
                      ? darkMode ? 'bg-primary-900/20' : 'bg-primary-100'
                      : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <FaUser className={`h-5 w-5 ${
                      message.isAdmin 
                        ? 'text-primary-500'
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {message.isAdmin 
                            ? message.adminName || 'Admin'
                            : ticket.user.fullName
                          }
                        </span>
                        <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(message.timestamp)} {formatTime(message.timestamp)}
                        </span>
                      </div>
                      {message.isAdmin && (
                        <span className="text-xs text-primary-500">
                          Staff Response
                        </span>
                      )}
                    </div>
                    <div className={`p-4 rounded-lg ${
                      message.isAdmin
                        ? darkMode ? 'bg-primary-900/10' : 'bg-primary-50'
                        : darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {message.content}
                      </p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Attachments:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.attachments.map((attachment, idx) => (
                              <a
                                key={idx}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs px-3 py-1 rounded-full inline-flex items-center ${
                                  darkMode 
                                    ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                <FaPaperclip className="mr-1" /> {attachment.filename}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Reply Form */}
            {(ticket.status === 'open' || ticket.status === 'in_progress') && (
              <div className="pt-6">
                <div className="flex">
                  <div className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${
                    darkMode ? 'bg-primary-900/20' : 'bg-primary-100'
                  }`}>
                    <FaUser className="h-5 w-5 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Your Reply
                    </h4>
                    <div className={`border rounded-lg ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      <textarea
                        ref={replyInputRef}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows="5"
                        className={`w-full p-3 rounded-lg ${
                          darkMode 
                            ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500' 
                            : 'text-gray-900 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                        } border-0 focus:ring-0`}
                        placeholder="Type your response here..."
                      ></textarea>
                      
                      {/* Attachments Preview */}
                      {attachments.length > 0 && (
                        <div className={`p-3 border-t ${
                          darkMode ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                          <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Attachments:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {attachments.map((file, index) => (
                              <div 
                                key={index}
                                className={`text-xs px-3 py-1 rounded-full inline-flex items-center ${
                                  darkMode 
                                    ? 'bg-gray-600 text-gray-200' 
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                <FaPaperclip className="mr-1" />
                                {file.name}
                                <button
                                  onClick={() => removeAttachment(index)}
                                  className="ml-1 p-0.5 rounded-full hover:bg-gray-400"
                                >
                                  <FaTimesCircle className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex justify-between items-center p-3 border-t ${
                        darkMode ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        <label className={`cursor-pointer ${
                          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}>
                          <FaPaperclip className="h-5 w-5" />
                          <input
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={handleAttachmentChange}
                          />
                        </label>
                        
                        <button
                          onClick={handleAddReply}
                          disabled={actionStatus === 'loading' || !replyContent.trim()}
                          className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                            actionStatus === 'loading' || !replyContent.trim()
                              ? 'bg-primary-400 cursor-not-allowed'
                              : 'bg-primary-600 hover:bg-primary-700'
                          }`}
                        >
                          {actionStatus === 'loading' ? 'Sending...' : 'Send Reply'}
                          <FaPaperPlane className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Ticket Closed Message */}
            {(ticket.status === 'resolved' || ticket.status === 'closed') && (
              <div className="pt-6">
                <div className={`p-4 rounded-lg text-center ${
                  darkMode 
                    ? 'bg-gray-700' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {ticket.status === 'resolved' ? 'This ticket has been resolved.' : 'This ticket is closed.'}
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {ticket.status === 'resolved' 
                      ? 'If the issue is fully addressed, you can close this ticket.'
                      : 'If the issue is not fully resolved, you can reopen this ticket.'}
                  </p>
                  <button
                    onClick={ticket.status === 'resolved' ? handleCloseTicket : handleReopenTicket}
                    className={`mt-3 px-4 py-2 text-sm font-medium rounded-md ${
                      ticket.status === 'resolved'
                        ? darkMode 
                          ? 'bg-gray-600 text-white hover:bg-gray-500' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : darkMode
                          ? 'bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50'
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                  >
                    {ticket.status === 'resolved' ? 'Close Ticket' : 'Reopen Ticket'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Resolve Ticket Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Resolve Support Ticket
                </h3>
                
                <div className={`mb-4 p-4 rounded-lg ${
                  darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  <p className="text-sm flex items-start">
                    <FaInfoCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      You are about to mark this ticket as resolved. The customer will be notified. You can add a resolution note below.
                    </span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Resolution Note (Optional)
                  </label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className={`w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500'
                    } shadow-sm`}
                    rows="3"
                    placeholder="Add notes about how the issue was resolved..."
                  ></textarea>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ticket:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>#{ticket.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Subject:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ticket.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customer:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {ticket.user.fullName}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={handleResolveTicket}
                  disabled={actionStatus === 'loading'}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === 'loading' 
                      ? 'bg-green-500 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === 'loading' ? 'Processing...' : 'Mark as Resolved'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  disabled={actionStatus === 'loading'}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode 
                      ? 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default SupportTicketDetail;
