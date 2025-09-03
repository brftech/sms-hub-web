import { useState, useCallback, useMemo } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
// Unused imports removed: Card, Avatar, ScrollArea, Separator
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { useLiveMessaging } from "../contexts/LiveMessagingContext";
import { 
  Search, Filter, MoreVertical, Send, CheckCircle, 
  MessageSquare, Users, Archive, Trash2, Grid3X3, List, 
  Eye, Edit, Play, Plus, Bell, UserPlus, Lock, Globe, Settings, RefreshCw, Contact
} from "lucide-react";

interface Conversation {
  id: string;
  personName: string;
  company: string;
  assignedAgent: string;
  lastMessage: string;
  lastMessageDate: string;
  status: 'active' | 'resolved' | 'pending';
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  phoneNumber?: string;
}

interface Broadcast {
  id: string;
  title: string;
  created: string;
  creator: string;
  messageType: 'SMS' | 'MMS';
  segments: number;
  messageContent: string;
  totalRecipients: number;
  delivered: number;
  sent: number;
  failed: number;
  status: 'sent' | 'scheduled' | 'draft';
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  phoneNumber: string;
  email: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  tags: string[];
  lastContact: string;
  totalMessages: number;
  optInDate: string;
}

export default function PlatformDemo() {
  const { state } = useLiveMessaging();
  const [currentView, setCurrentView] = useState<'conversations' | 'broadcasts' | 'contacts'>('conversations');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("any");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Mock conversation data
  const conversations: Conversation[] = useMemo(() => [
    {
      id: "1",
      personName: "Jake Davis",
      company: "Anstead's Cigar",
      assignedAgent: "Charles",
      lastMessage: "Thanks for contacting Gnymble Support! Someone will get with you ASAP. Promise :)",
      lastMessageDate: "08/29/2025",
      status: 'active',
      priority: 'high',
      isRead: false,
      phoneNumber: "+1 (555) 123-4567",
    },
    {
      id: "2",
      personName: "Impact Workforce",
      company: "Impact Workforce",
      assignedAgent: "John",
      lastMessage: "I have a question about our recent order",
      lastMessageDate: "08/28/2025",
      status: 'active',
      priority: 'medium',
      isRead: false,
      phoneNumber: "+1 (555) 234-5678",
    },
    {
      id: "3",
      personName: "Bucksnorts Cigar",
      company: "Bucksnorts Cigar",
      assignedAgent: "Charles",
      lastMessage: "Can you help me with my account?",
      lastMessageDate: "08/27/2025",
      status: 'resolved',
      priority: 'low',
      isRead: true,
      phoneNumber: "+1 (555) 345-6789",
    },
    {
      id: "4",
      personName: "Phone Demo User",
      company: "SMS Hub Demo",
      assignedAgent: "AI Assistant",
      lastMessage: state.messages.length > 0 ? state.messages[state.messages.length - 1].text : "Start a conversation",
      lastMessageDate: new Date().toLocaleDateString(),
      status: 'active',
      priority: 'high',
      isRead: false,
      phoneNumber: "+1 (555) 999-8888",
    },
  ], [state.messages]);

  // Mock broadcast data
  const broadcasts: Broadcast[] = useMemo(() => [
    {
      id: "1",
      title: "TEST",
      created: "08/12/2025 7:15 AM",
      creator: "Zapier Gnymble",
      messageType: "SMS",
      segments: 1,
      messageContent: "BlahBlahBLah",
      totalRecipients: 1,
      delivered: 1,
      sent: 0,
      failed: 0,
      status: 'sent',
    },
    {
      id: "2",
      title: "TEST1010",
      created: "08/11/2025 2:30 PM",
      creator: "Justin Castellat",
      messageType: "SMS",
      segments: 10,
      messageContent: "Test",
      totalRecipients: 10,
      delivered: 10,
      sent: 0,
      failed: 0,
      status: 'sent',
    },
    {
      id: "3",
      title: "Weekly Update",
      created: "08/10/2025 9:00 AM",
      creator: "Marketing Team",
      messageType: "SMS",
      segments: 5,
      messageContent: "Testing",
      totalRecipients: 50,
      delivered: 48,
      sent: 2,
      failed: 0,
      status: 'sent',
    },
  ], []);

  // Mock contact data
  const contacts: Contact[] = useMemo(() => [
    {
      id: "1",
      firstName: "Jake",
      lastName: "Davis",
      company: "Anstead's Cigar",
      phoneNumber: "+1 (555) 123-4567",
      email: "jake@ansteads.com",
      status: 'active',
      tags: ['VIP', 'Cigar'],
      lastContact: "08/29/2025",
      totalMessages: 24,
      optInDate: "01/15/2025",
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      company: "Impact Workforce",
      phoneNumber: "+1 (555) 234-5678",
      email: "sarah@impactworkforce.com",
      status: 'active',
      tags: ['Business', 'Recruitment'],
      lastContact: "08/28/2025",
      totalMessages: 18,
      optInDate: "02/20/2025",
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Wilson",
      company: "Bucksnorts Cigar",
      phoneNumber: "+1 (555) 345-6789",
      email: "mike@bucksnorts.com",
      status: 'active',
      tags: ['Cigar', 'Regular'],
      lastContact: "08/27/2025",
      totalMessages: 31,
      optInDate: "01/10/2025",
    },
    {
      id: "4",
      firstName: "Lisa",
      lastName: "Brown",
      company: "Phone Demo",
      phoneNumber: "+1 (555) 999-8888",
      email: "demo@smshub.com",
      status: 'active',
      tags: ['Demo', 'Test'],
      lastContact: new Date().toLocaleDateString(),
      totalMessages: state.messages.length,
      optInDate: "08/01/2025",
    },
    {
      id: "5",
      firstName: "David",
      lastName: "Miller",
      company: "Food Truck Co",
      phoneNumber: "+1 (555) 456-7890",
      email: "david@foodtruck.com",
      status: 'inactive',
      tags: ['Food', 'Inactive'],
      lastContact: "07/15/2025",
      totalMessages: 8,
      optInDate: "03/01/2025",
    },
  ], [state.messages]);

  // Filter conversations based on search and status
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const matchesSearch = conv.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || conv.status === statusFilter;
      const matchesAssignment = assignmentFilter === "any" || conv.assignedAgent.toLowerCase().includes(assignmentFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesAssignment;
    });
  }, [conversations, searchQuery, statusFilter, assignmentFilter]);

  // Filter broadcasts based on search
  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter(broadcast => {
      const matchesSearch = broadcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           broadcast.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           broadcast.messageContent.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [broadcasts, searchQuery]);

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.phoneNumber.includes(searchQuery);
      return matchesSearch;
    });
  }, [contacts, searchQuery]);



  // Handle view toggle
  // Unused function removed: handleViewToggle

  // Handle view mode toggle
  const handleViewModeToggle = useCallback(() => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  }, []);

  // Handle sidebar navigation
  const handleSidebarNavigation = useCallback((view: 'conversations' | 'broadcasts' | 'contacts') => {
    setCurrentView(view);
  }, []);

  // Handle header view toggle
  const handleHeaderViewToggle = useCallback((view: 'conversations' | 'broadcasts' | 'contacts') => {
    setCurrentView(view);
  }, []);

  // Unused function removed: getPriorityColor

  // Unused function removed: getStatusColor

  // Get contact status color
  const getContactStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'unsubscribed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-gray-100 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SMS Hub Platform</h1>
              <p className="text-sm text-gray-600">Live Demo Environment</p>
            </div>
          </div>

          {/* Center - Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="h-9 px-4">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Persons
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4">
              <Lock className="w-4 h-4 mr-2" />
              Private Mode
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4">
              <Send className="w-4 h-4 mr-2" />
              Send Broadcast
            </Button>
          </div>

          {/* Right Side - User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              BH
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="flex">
        <div className="w-16 bg-blue-900 flex flex-col items-center py-4 space-y-4">
          {/* Logo */}
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-2xl mb-4">
            S
          </div>

          {/* Navigation Icons */}
          <button 
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              currentView === 'conversations' 
                ? 'bg-orange-500 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => handleSidebarNavigation('conversations')}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          
          <button 
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              currentView === 'broadcasts' 
                ? 'bg-orange-500 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => handleSidebarNavigation('broadcasts')}
          >
            <Send className="h-5 w-5" />
          </button>

          <button 
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              currentView === 'contacts' 
                ? 'bg-orange-500 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => handleSidebarNavigation('contacts')}
          >
            <Contact className="h-5 w-5" />
          </button>

          <button className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <RefreshCw className="h-5 w-5" />
          </button>

          <div className="flex-1"></div>

          <button className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <Users className="h-5 w-5" />
          </button>
          <button className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <Globe className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Content Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              {/* Left - Context and View Toggle */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {currentView === 'conversations' ? 'Support' : currentView === 'broadcasts' ? 'Broadcasts' : 'Contacts'}
                  </span>
                  {currentView === 'conversations' && (
                    <span className="text-sm text-gray-600">+1 757-447-0202</span>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* View Toggle Buttons */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'conversations'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleHeaderViewToggle('conversations')}
                  >
                    Conversations
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'broadcasts'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleHeaderViewToggle('broadcasts')}
                  >
                    Broadcasts
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'contacts'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleHeaderViewToggle('contacts')}
                  >
                    Contacts
                  </button>
                </div>
              </div>

              {/* Right - View Mode and Actions */}
              <div className="flex items-center space-x-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={handleViewModeToggle}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={handleViewModeToggle}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-9"
                />
              </div>

              {currentView === 'conversations' && (
                <>
                  <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); }}>
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Status: All</SelectItem>
                      <SelectItem value="active">Status: Active</SelectItem>
                      <SelectItem value="resolved">Status: Resolved</SelectItem>
                      <SelectItem value="pending">Status: Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={assignmentFilter} onValueChange={(value) => { setAssignmentFilter(value); }}>
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Assignment: Any</SelectItem>
                      <SelectItem value="charles">Charles</SelectItem>
                      <SelectItem value="john">John</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}

              {currentView === 'broadcasts' && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-9 px-4">
                    All
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-4">
                    Food Truck
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-4">
                    New
                  </Button>
                </div>
              )}

              {currentView === 'contacts' && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-9 px-4">
                    All
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-4">
                    Active
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-4">
                    Inactive
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content Table */}
          <div className="bg-white">
            {currentView === 'conversations' ? (
              /* Conversations Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Persons
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredConversations.map((conversation) => (
                      <tr key={conversation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {conversation.personName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {conversation.personName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {conversation.company}
                              </div>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-xs text-gray-600">
                                  {conversation.assignedAgent}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {conversation.lastMessage}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessageDate}
                            </span>
                            <CheckCircle className="w-3 h-3 text-green-500 ml-2" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <UserPlus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Bell className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              Hide
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : currentView === 'broadcasts' ? (
              /* Broadcasts Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Broadcast Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statistics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBroadcasts.map((broadcast) => (
                      <tr key={broadcast.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {broadcast.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created: {broadcast.created}
                          </div>
                          <div className="text-sm text-gray-500">
                            Creator: {broadcast.creator}
                          </div>
                          <div className="text-sm text-gray-500">
                            {broadcast.messageType}: {broadcast.segments}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-green-600 font-medium">
                            {broadcast.messageContent}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Total Recipients: {broadcast.totalRecipients}
                          </div>
                          <div className="text-sm text-gray-500">
                            Delivered: {broadcast.delivered}
                          </div>
                          <div className="text-sm text-gray-500">
                            Sent: {broadcast.sent}
                          </div>
                          <div className="text-sm text-gray-500">
                            Failed: {broadcast.failed}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Contacts Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company & Tags
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {contact.firstName} {contact.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {contact.phoneNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {contact.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.company}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contact.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-1">
                            <Badge className={`text-xs ${getContactStatusColor(contact.status)}`}>
                              {contact.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Last Contact: {contact.lastContact}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total Messages: {contact.totalMessages}
                          </div>
                          <div className="text-sm text-gray-500">
                            Opt-in: {contact.optInDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <UserPlus className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* New Item Button */}
            <div className="p-6 text-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                <Plus className="w-5 h-5 mr-2" />
                {currentView === 'conversations' ? 'New Conversation' : currentView === 'broadcasts' ? 'New Broadcast' : 'New Contact'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
