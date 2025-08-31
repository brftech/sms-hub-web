
export interface CustomerConversation {
  customerId: string;
  phoneNumber: string;
  displayName: string;
  messages: any[];
  lastMessage: any;
  lastMessageTime: string;
  unreadCount: number;
}

// Generate consistent phone numbers for demo customers
const generatePhoneNumber = (seed: number): string => {
  const area = 555;
  const exchange = 100 + (seed % 900);
  const number = 1000 + (seed % 9000);
  return `(${area}) ${exchange}-${number}`;
};

// Generate customer display name
const generateCustomerName = (seed: number): string => {
  const names = [
    "John Smith", "Sarah Johnson", "Mike Davis", "Lisa Wilson", 
    "David Brown", "Emma Martinez", "Chris Taylor", "Ashley Garcia"
  ];
  return names[seed % names.length];
};

// Group messages by customer using a hash-based approach
export const groupMessagesByCustomer = (messages: any[]): CustomerConversation[] => {
  const customerMap = new Map<string, CustomerConversation>();
  
  // Process messages in chronological order
  messages.forEach((message) => {
    // Create a consistent customer ID based on message content/timing
    // For demo purposes, we'll simulate 2-3 different customers
    let customerSeed = 0;
    if (message.text.toLowerCase().includes('yes') || message.text.toLowerCase().includes('interested')) {
      customerSeed = 1;
    } else if (message.text.toLowerCase().includes('no') || message.text.toLowerCase().includes('not')) {
      customerSeed = 2;
    } else if (message.text.toLowerCase().includes('ok') || message.text.toLowerCase().includes('thanks')) {
      customerSeed = 1; // Same as the interested customer
    }
    
    const customerId = `customer_${customerSeed}`;
    const phoneNumber = generatePhoneNumber(customerSeed);
    const displayName = generateCustomerName(customerSeed);
    
    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        customerId,
        phoneNumber,
        displayName,
        messages: [],
        lastMessage: message,
        lastMessageTime: message.timestamp,
        unreadCount: 0
      });
    }
    
    const customer = customerMap.get(customerId)!;
    customer.messages.push(message);
    customer.lastMessage = message;
    customer.lastMessageTime = message.timestamp;
    
    // Only count customer messages as unread
    if (message.type === 'sent') {
      customer.unreadCount++;
    }
  });
  
  // Sort conversations by last message time (newest first)
  return Array.from(customerMap.values()).sort((a, b) => {
    const timeA = new Date(`1970-01-01 ${a.lastMessageTime}`).getTime();
    const timeB = new Date(`1970-01-01 ${b.lastMessageTime}`).getTime();
    return timeB - timeA;
  });
};
