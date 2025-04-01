import { faker } from '@faker-js/faker';

/**
 * Generate mock users for the admin panel
 * @param {number} count - Number of users to generate
 * @returns {Array} Array of user objects
 */
export const generateMockUsers = (count = 50) => {
  const statuses = ['active', 'inactive', 'suspended', 'pending_verification'];
  const userTypes = ['basic', 'premium', 'vip'];
  
  return Array.from({ length: count }, (_, index) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    return {
      id: `user-${index + 1}`,
      fullName,
      email,
      phone: faker.phone.number(),
      country: faker.location.country(),
      accountNumber: faker.finance.accountNumber(10),
      status: faker.helpers.arrayElement(statuses),
      userType: faker.helpers.arrayElement(userTypes),
      balance: parseFloat(faker.finance.amount(100, 50000, 2)),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
      kycVerified: faker.helpers.arrayElement([true, false]),
      lastLogin: faker.date.recent({ days: 10 }).toISOString(),
      profileImage: faker.image.avatar(),
      referredBy: index > 10 ? `user-${faker.number.int({ min: 1, max: 10 })}` : null,
      emailVerified: faker.helpers.arrayElement([true, false]),
      twoFactorEnabled: faker.helpers.arrayElement([true, false])
    };
  });
};

/**
 * Generate mock transactions for the admin panel
 * @param {number} count - Number of transactions to generate
 * @returns {Array} Array of transaction objects
 */
export const generateMockTransactions = (count = 100) => {
  const types = ['deposit', 'withdrawal', 'investment', 'transfer', 'fee'];
  const statuses = ['pending', 'completed', 'failed', 'rejected'];
  const paymentMethods = ['bank_transfer', 'credit_card', 'paypal', 'crypto'];
  
  return Array.from({ length: count }, (_, index) => {
    const type = faker.helpers.arrayElement(types);
    const status = faker.helpers.arrayElement(statuses);
    const amount = parseFloat(faker.finance.amount(50, 10000, 2));
    
    return {
      id: `tx-${index + 1}`,
      type,
      status,
      amount,
      currency: 'USD',
      fee: parseFloat((amount * 0.01).toFixed(2)),
      date: faker.date.recent({ days: 90 }).toISOString(),
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      user: {
        id: `user-${faker.number.int({ min: 1, max: 50 })}`,
        fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: faker.internet.email().toLowerCase()
      },
      details: type === 'deposit' || type === 'withdrawal' 
        ? {
            bankName: type === 'bank_transfer' ? faker.company.name() : null,
            accountNumber: type === 'bank_transfer' ? faker.finance.accountNumber() : null,
            cardLast4: type === 'credit_card' ? faker.finance.creditCardNumber('####') : null,
            cryptoAddress: type === 'crypto' ? `0x${faker.string.hexadecimal({ length: 40 }).substring(2)}` : null
          }
        : {},
      updatedAt: status !== 'pending' ? faker.date.recent({ days: 30 }).toISOString() : null,
      completedAt: status === 'completed' ? faker.date.recent({ days: 30 }).toISOString() : null
    };
  });
};

/**
 * Generate mock KYC verification requests for the admin panel
 * @param {number} count - Number of requests to generate
 * @returns {Array} Array of KYC request objects
 */
export const generateMockKycRequests = (count = 75) => {
  const statuses = ['pending', 'approved', 'rejected', 'waiting_for_documents'];
  const documentTypes = ['passport', 'national_id', 'driving_license', 'utility_bill'];
  
  return Array.from({ length: count }, (_, index) => {
    const user = {
      id: `user-${faker.number.int({ min: 1, max: 50 })}`,
      fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email().toLowerCase()
    };
    
    const status = faker.helpers.arrayElement(statuses);
    const submittedAt = faker.date.recent({ days: 90 }).toISOString();
    const updatedAt = status !== 'pending' 
      ? faker.date.between({ from: submittedAt, to: new Date() }).toISOString() 
      : null;
    
    return {
      id: `kyc-${index + 1}`,
      user,
      status,
      submittedAt,
      updatedAt,
      documents: [
        {
          type: faker.helpers.arrayElement(documentTypes),
          status: status,
          url: `https://example.com/documents/${user.id}/${faker.helpers.arrayElement(documentTypes)}.jpg`
        },
        {
          type: 'selfie',
          status: status,
          url: `https://example.com/documents/${user.id}/selfie.jpg`
        }
      ],
      information: {
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0]
      },
      notes: status === 'rejected' 
        ? faker.helpers.arrayElement([
            'Documents unclear or illegible',
            'Information mismatch',
            'Expired documents',
            'Suspected identity fraud'
          ]) 
        : null,
      approvedBy: status === 'approved' ? 'admin-1' : null,
      rejectedBy: status === 'rejected' ? 'admin-1' : null
    };
  });
};

/**
 * Generate mock support tickets for the admin panel
 * @param {number} count - Number of tickets to generate
 * @returns {Array} Array of support ticket objects
 */
export const generateMockSupportTickets = (count = 80) => {
  const statuses = ['open', 'in_progress', 'responded', 'resolved', 'closed'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const categories = ['account', 'deposit', 'withdrawal', 'technical', 'general', 'investment'];
  
  return Array.from({ length: count }, (_, index) => {
    const user = {
      id: `user-${faker.number.int({ min: 1, max: 50 })}`,
      fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email().toLowerCase()
    };
    
    const status = faker.helpers.arrayElement(statuses);
    const createdAt = faker.date.recent({ days: 90 }).toISOString();
    
    const replies = [];
    if (status !== 'open') {
      // Add 1-3 replies for non-open tickets
      const replyCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < replyCount; i++) {
        const isAdmin = i % 2 === 0; // Alternate between admin and user
        replies.push({
          id: `reply-${index}-${i}`,
          content: faker.lorem.paragraph(),
          createdAt: faker.date.between({ from: createdAt, to: new Date() }).toISOString(),
          sender: isAdmin 
            ? { id: 'admin-1', name: 'Admin User', role: 'admin' }
            : { id: user.id, name: user.fullName, role: 'user' }
        });
      }
      
      // Sort replies by date
      replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    return {
      id: `ticket-${index + 1}`,
      subject: faker.helpers.arrayElement([
        'Issue with withdrawal',
        'Cannot access my account',
        'Question about investment plans',
        'Payment not showing up',
        'How to change my password',
        'Verification documents issue',
        'Platform not working properly'
      ]),
      category: faker.helpers.arrayElement(categories),
      content: faker.lorem.paragraphs(2),
      user,
      status,
      priority: faker.helpers.arrayElement(priorities),
      createdAt,
      updatedAt: replies.length > 0 ? replies[replies.length - 1].createdAt : createdAt,
      lastActivity: replies.length > 0 ? replies[replies.length - 1].createdAt : createdAt,
      replies,
      assignedTo: status === 'in_progress' || status === 'responded' 
        ? { id: 'admin-1', name: 'Admin User' } 
        : null,
      resolutionNote: status === 'resolved' || status === 'closed' 
        ? faker.lorem.paragraph() 
        : null
    };
  });
};
