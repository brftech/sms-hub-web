// =============================================================================
// PLATFORM INTERACTIVE COMPONENT - BUSINESS OWNER VIEW
// =============================================================================

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Send,
  Users,
  MessageSquare,
  Radio,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building2,
} from "lucide-react";
import { useHub } from "@/contexts/HubContext";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  status: "online" | "offline" | "away";
  unreadCount: number;
}

interface Message {
  id: string;
  text: string;
  sender: "business" | "customer";
  timestamp: string;
  customerId?: string;
  isBroadcast?: boolean;
  deliveryStatus?: "sent" | "delivered" | "read";
}

interface PlatformInteractiveProps {
  onMessageToPlatform?: (message: Message) => void;
  onBroadcastMessage?: (message: string, customerIds: string[]) => void;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "customer-1",
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    lastMessage: "Thanks for the event invite! I'll be there.",
    timestamp: "2 min ago",
    status: "online",
    unreadCount: 0,
  },
  {
    id: "customer-2",
    name: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    lastMessage: "Do you have any Montecristo No. 2s in stock?",
    timestamp: "5 min ago",
    status: "online",
    unreadCount: 2,
  },
  {
    id: "customer-3",
    name: "Mike Chen",
    phone: "+1 (555) 345-6789",
    lastMessage: "What time does the humidor maintenance start?",
    timestamp: "1 hour ago",
    status: "away",
    unreadCount: 1,
  },
  {
    id: "customer-4",
    name: "Emily Davis",
    phone: "+1 (555) 456-7890",
    lastMessage: "Perfect! I'll take the Opus X box.",
    timestamp: "3 hours ago",
    status: "offline",
    unreadCount: 0,
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

const PlatformInteractive: React.FC<PlatformInteractiveProps> = ({
  onMessageToPlatform,
  onBroadcastMessage,
}) => {
  const { currentHub, hubConfig } = useHub();
  const [activeView, setActiveView] = useState<"conversations" | "broadcast">(
    "conversations"
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    MOCK_CUSTOMERS[0]
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  // Initialize with some mock conversation messages
  useEffect(() => {
    if (selectedCustomer) {
      const mockMessages: Message[] = [
        {
          id: "msg-1",
          text: selectedCustomer.lastMessage,
          sender: "customer",
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
          customerId: selectedCustomer.id,
        },
        {
          id: "msg-2",
          text: "Thanks for reaching out! How can I help you today?",
          sender: "business",
          timestamp: new Date(Date.now() - 240000).toISOString(), // 4 min ago
          deliveryStatus: "read",
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedCustomer]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedCustomer) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage.trim(),
      sender: "business",
      timestamp: new Date().toISOString(),
      customerId: selectedCustomer.id,
      deliveryStatus: "sent",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Notify parent component
    onMessageToPlatform?.(message);

    // Simulate delivery status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, deliveryStatus: "delivered" } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, deliveryStatus: "read" } : msg
        )
      );
    }, 3000);
  }, [newMessage, selectedCustomer, onMessageToPlatform]);

  const handleBroadcast = useCallback(() => {
    if (!broadcastMessage.trim()) return;

    const customerIds =
      selectedCustomerIds.length > 0
        ? selectedCustomerIds
        : customers.map((c) => c.id);

    // Send broadcast
    onBroadcastMessage?.(broadcastMessage, customerIds);

    // Clear form
    setBroadcastMessage("");
    setSelectedCustomerIds([]);

    // Show success feedback
    alert(`Broadcast sent to ${customerIds.length} customers!`);
  }, [broadcastMessage, selectedCustomerIds, customers, onBroadcastMessage]);

  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDeliveryIcon = (status?: Message["deliveryStatus"]) => {
    switch (status) {
      case "sent":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCircle className="w-3 h-3 text-blue-400" />;
      case "read":
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{hubConfig?.name} Platform</h2>
              <p className="text-gray-300">Business Owner Dashboard</p>
            </div>
          </div>
          <Badge className="bg-green-600 text-white">4 Active Customers</Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mt-6">
          <Button
            variant={activeView === "conversations" ? "secondary" : "ghost"}
            onClick={() => setActiveView("conversations")}
            className="text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Conversations
          </Button>
          <Button
            variant={activeView === "broadcast" ? "secondary" : "ghost"}
            onClick={() => setActiveView("broadcast")}
            className="text-white"
          >
            <Radio className="w-4 h-4 mr-2" />
            Broadcast
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-96">
        {activeView === "conversations" ? (
          <>
            {/* Customer List */}
            <div className="w-1/3 border-r border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Active Conversations
                </h3>
              </div>
              <div className="overflow-y-auto h-full">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedCustomer?.id === customer.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">
                          {customer.name}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(
                            customer.status
                          )}`}
                        />
                      </div>
                      {customer.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {customer.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Phone className="w-3 h-3 mr-1" />
                      {customer.phone}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {customer.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {customer.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col">
              {selectedCustomer ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-gray-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {selectedCustomer.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          selectedCustomer.status
                        )}`}
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "business"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender === "business"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                            {message.sender === "business" && (
                              <div className="ml-2">
                                {getDeliveryIcon(message.deliveryStatus)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </>
        ) : (
          /* Broadcast View */
          <div className="w-full p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Radio className="w-5 h-5 mr-2" />
                  Send Broadcast Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <Textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter your broadcast message..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients (
                    {selectedCustomerIds.length > 0
                      ? selectedCustomerIds.length
                      : customers.length}{" "}
                    selected)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {customers.map((customer) => (
                      <label
                        key={customer.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCustomerIds.includes(customer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomerIds((prev) => [
                                ...prev,
                                customer.id,
                              ]);
                            } else {
                              setSelectedCustomerIds((prev) =>
                                prev.filter((id) => id !== customer.id)
                              );
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{customer.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleBroadcast}
                  disabled={!broadcastMessage.trim()}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Broadcast
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformInteractive;
