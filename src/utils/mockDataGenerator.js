import { faker } from "@faker-js/faker";

/**
 * Generate mock users for the admin panel
 * @param {number} count - Number of users to generate
 * @returns {Array} Array of user objects
 */
export const generateMockUsers = (count = 50) => {
  const statuses = ["active", "inactive", "suspended", "pending_verification"];
  const userTypes = ["basic", "premium", "vip"];

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
      referredBy:
        index > 10 ? `user-${faker.number.int({ min: 1, max: 10 })}` : null,
      emailVerified: faker.helpers.arrayElement([true, false]),
      twoFactorEnabled: faker.helpers.arrayElement([true, false]),
    };
  });
};

/**
 * Generate mock transactions for the admin panel
 * @param {number} count - Number of transactions to generate
 * @returns {Array} Array of transaction objects
 */
export const generateMockTransactions = (count = 100) => {
  const types = ["deposit", "withdrawal", "investment", "transfer", "fee"];
  const statuses = ["pending", "completed", "failed", "rejected"];
  const paymentMethods = ["bank_transfer", "credit_card", "paypal", "crypto"];

  return Array.from({ length: count }, (_, index) => {
    const type = faker.helpers.arrayElement(types);
    const status = faker.helpers.arrayElement(statuses);
    const amount = parseFloat(faker.finance.amount(50, 10000, 2));

    return {
      id: `tx-${index + 1}`,
      type,
      status,
      amount,
      currency: "USD",
      fee: parseFloat((amount * 0.01).toFixed(2)),
      date: faker.date.recent({ days: 90 }).toISOString(),
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      user: {
        id: `user-${faker.number.int({ min: 1, max: 50 })}`,
        fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: faker.internet.email().toLowerCase(),
      },
      details:
        type === "deposit" || type === "withdrawal"
          ? {
              bankName: type === "bank_transfer" ? faker.company.name() : null,
              accountNumber:
                type === "bank_transfer" ? faker.finance.accountNumber() : null,
              cardLast4:
                type === "credit_card"
                  ? faker.finance.creditCardNumber("####")
                  : null,
              cryptoAddress:
                type === "crypto"
                  ? `0x${faker.string.hexadecimal({ length: 40 }).substring(2)}`
                  : null,
            }
          : {},
      updatedAt:
        status !== "pending"
          ? faker.date.recent({ days: 30 }).toISOString()
          : null,
      completedAt:
        status === "completed"
          ? faker.date.recent({ days: 30 }).toISOString()
          : null,
    };
  });
};

/**
 * Generate mock KYC verification requests for the admin panel
 * @param {number} count - Number of requests to generate
 * @returns {Array} Array of KYC request objects
 */
export const generateMockKycRequests = (count = 75) => {
  const statuses = ["pending", "approved", "rejected", "waiting_for_documents"];
  const documentTypes = [
    "passport",
    "national_id",
    "driving_license",
    "utility_bill",
  ];

  return Array.from({ length: count }, (_, index) => {
    const user = {
      id: `user-${faker.number.int({ min: 1, max: 50 })}`,
      fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email().toLowerCase(),
    };

    const status = faker.helpers.arrayElement(statuses);
    const submittedAt = faker.date.recent({ days: 90 }).toISOString();
    const updatedAt =
      status !== "pending"
        ? faker.date
            .between({ from: submittedAt, to: new Date() })
            .toISOString()
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
          url: `https://example.com/documents/${user.id}/${faker.helpers.arrayElement(documentTypes)}.jpg`,
        },
        {
          type: "selfie",
          status: status,
          url: `https://example.com/documents/${user.id}/selfie.jpg`,
        },
      ],
      information: {
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        dateOfBirth: faker.date
          .birthdate({ min: 18, max: 80, mode: "age" })
          .toISOString()
          .split("T")[0],
      },
      notes:
        status === "rejected"
          ? faker.helpers.arrayElement([
              "Documents unclear or illegible",
              "Information mismatch",
              "Expired documents",
              "Suspected identity fraud",
            ])
          : null,
      approvedBy: status === "approved" ? "admin-1" : null,
      rejectedBy: status === "rejected" ? "admin-1" : null,
    };
  });
};

/**
 * Generate mock support tickets for the admin panel
 * @param {number} count - Number of tickets to generate
 * @returns {Array} Array of support ticket objects
 */
export const generateMockSupportTickets = (count = 80) => {
  const statuses = ["open", "in_progress", "responded", "resolved", "closed"];
  const priorities = ["low", "medium", "high", "urgent"];
  const categories = [
    "account",
    "deposit",
    "withdrawal",
    "technical",
    "general",
    "investment",
  ];

  return Array.from({ length: count }, (_, index) => {
    const user = {
      id: `user-${faker.number.int({ min: 1, max: 50 })}`,
      fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email().toLowerCase(),
    };

    const status = faker.helpers.arrayElement(statuses);
    const createdAt = faker.date.recent({ days: 90 }).toISOString();

    const replies = [];
    if (status !== "open") {
      // Add 1-3 replies for non-open tickets
      const replyCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < replyCount; i++) {
        const isAdmin = i % 2 === 0; // Alternate between admin and user
        replies.push({
          id: `reply-${index}-${i}`,
          content: faker.lorem.paragraph(),
          createdAt: faker.date
            .between({ from: createdAt, to: new Date() })
            .toISOString(),
          sender: isAdmin
            ? { id: "admin-1", name: "Admin User", role: "admin" }
            : { id: user.id, name: user.fullName, role: "user" },
        });
      }

      // Sort replies by date
      replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return {
      id: `ticket-${index + 1}`,
      subject: faker.helpers.arrayElement([
        "Issue with withdrawal",
        "Cannot access my account",
        "Question about investment plans",
        "Payment not showing up",
        "How to change my password",
        "Verification documents issue",
        "Platform not working properly",
      ]),
      category: faker.helpers.arrayElement(categories),
      content: faker.lorem.paragraphs(2),
      user,
      status,
      priority: faker.helpers.arrayElement(priorities),
      createdAt,
      updatedAt:
        replies.length > 0 ? replies[replies.length - 1].createdAt : createdAt,
      lastActivity:
        replies.length > 0 ? replies[replies.length - 1].createdAt : createdAt,
      replies,
      assignedTo:
        status === "in_progress" || status === "responded"
          ? { id: "admin-1", name: "Admin User" }
          : null,
      resolutionNote:
        status === "resolved" || status === "closed"
          ? faker.lorem.paragraph()
          : null,
    };
  });
};

// Mock data generator utility functions for trading app

/**
 * Generates mock trading pairs
 * @returns {Array} Array of trading pair objects
 */
export const generateMockTradingPairs = () => {
  // Cryptocurrencies
  const cryptoBaseCurrencies = [
    "BTC",
    "ETH",
    "SOL",
    "ADA",
    "DOT",
    "AVAX",
    "MATIC",
    "XRP",
    "BNB",
    "LINK",
  ];
  const cryptoQuoteCurrencies = ["USDT", "USDC", "USD", "BUSD"];

  // Stocks
  const stocks = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "META",
    "TSLA",
    "NVDA",
    "JPM",
    "V",
    "WMT",
  ];

  // Commodities
  const commodities = [
    "GOLD",
    "SILVER",
    "OIL",
    "NAT.GAS",
    "COPPER",
    "WHEAT",
    "CORN",
    "COFFEE",
  ];

  // Forex pairs
  const forexPairs = [
    "EUR/USD",
    "USD/JPY",
    "GBP/USD",
    "USD/CHF",
    "AUD/USD",
    "USD/CAD",
    "NZD/USD",
    "EUR/GBP",
  ];

  const tradingPairs = [];

  // Generate crypto trading pairs
  cryptoBaseCurrencies.forEach((base) => {
    cryptoQuoteCurrencies.forEach((quote) => {
      // Only add some combinations to keep the list realistic
      if (Math.random() > 0.3) {
        const basePrice = getBasePrice(base);
        const symbol = `${base}/${quote}`;

        tradingPairs.push({
          symbol,
          base,
          quote,
          baseMinSize: getMinSize(base),
          quoteMinSize: getMinSize(quote),
          priceDecimals: getPriceDecimals(base),
          quantityDecimals: getQuantityDecimals(base),
          basePrice,
          isFavorite: Math.random() > 0.7,
          assetType: "crypto",
        });
      }
    });
  });

  // Generate stock trading pairs
  stocks.forEach((stock) => {
    const basePrice = getStockPrice(stock);
    const symbol = `${stock}/USD`;

    tradingPairs.push({
      symbol,
      base: stock,
      quote: "USD",
      baseMinSize: 0.01,
      quoteMinSize: 1,
      priceDecimals: 2,
      quantityDecimals: 2,
      basePrice,
      isFavorite: Math.random() > 0.7,
      assetType: "stock",
    });
  });

  // Generate commodity trading pairs
  commodities.forEach((commodity) => {
    const basePrice = getCommodityPrice(commodity);
    const symbol = `${commodity}/USD`;

    tradingPairs.push({
      symbol,
      base: commodity,
      quote: "USD",
      baseMinSize: 0.01,
      quoteMinSize: 1,
      priceDecimals: 2,
      quantityDecimals: 2,
      basePrice,
      isFavorite: Math.random() > 0.7,
      assetType: "commodity",
    });
  });

  // Add forex pairs directly
  forexPairs.forEach((pair) => {
    const [base, quote] = pair.split("/");
    const basePrice = getForexPrice(pair);

    tradingPairs.push({
      symbol: pair,
      base,
      quote,
      baseMinSize: 0.01,
      quoteMinSize: 0.01,
      priceDecimals: 4,
      quantityDecimals: 2,
      basePrice,
      isFavorite: Math.random() > 0.7,
      assetType: "forex",
    });
  });

  return tradingPairs;
};

// Helper functions
function getBasePrice(base) {
  const basePrices = {
    BTC: 30000 + Math.random() * 5000,
    ETH: 2000 + Math.random() * 300,
    SOL: 100 + Math.random() * 20,
    ADA: 0.5 + Math.random() * 0.1,
    DOT: 10 + Math.random() * 2,
    AVAX: 25 + Math.random() * 5,
    MATIC: 1 + Math.random() * 0.2,
    XRP: 0.8 + Math.random() * 0.1,
    BNB: 300 + Math.random() * 30,
    LINK: 15 + Math.random() * 3,
  };

  return basePrices[base] || 100;
}

function getStockPrice(stock) {
  const stockPrices = {
    AAPL: 150 + Math.random() * 30,
    MSFT: 300 + Math.random() * 50,
    GOOGL: 120 + Math.random() * 20,
    AMZN: 130 + Math.random() * 25,
    META: 200 + Math.random() * 40,
    TSLA: 250 + Math.random() * 50,
    NVDA: 400 + Math.random() * 80,
    JPM: 150 + Math.random() * 20,
    V: 230 + Math.random() * 30,
    WMT: 60 + Math.random() * 10,
  };

  return stockPrices[stock] || 100;
}

function getCommodityPrice(commodity) {
  const commodityPrices = {
    GOLD: 1900 + Math.random() * 200,
    SILVER: 25 + Math.random() * 5,
    OIL: 80 + Math.random() * 15,
    "NAT.GAS": 2.5 + Math.random() * 0.5,
    COPPER: 3.8 + Math.random() * 0.4,
    WHEAT: 6 + Math.random() * 1,
    CORN: 4 + Math.random() * 0.8,
    COFFEE: 160 + Math.random() * 30,
  };

  return commodityPrices[commodity] || 100;
}

function getForexPrice(pair) {
  const forexPrices = {
    "EUR/USD": 1.08 + Math.random() * 0.02,
    "USD/JPY": 145 + Math.random() * 10,
    "GBP/USD": 1.25 + Math.random() * 0.03,
    "USD/CHF": 0.9 + Math.random() * 0.02,
    "AUD/USD": 0.65 + Math.random() * 0.02,
    "USD/CAD": 1.35 + Math.random() * 0.03,
    "NZD/USD": 0.6 + Math.random() * 0.01,
    "EUR/GBP": 0.85 + Math.random() * 0.01,
  };

  return forexPrices[pair] || 1;
}

/**
 * Generates a mock order book for a given symbol
 * @param {string} symbol - The trading pair symbol
 * @returns {Object} Order book with bids and asks
 */
export const generateMockOrderBook = (symbol) => {
  const [base, quote] = symbol.split("/");
  const basePrice = getBasePrice(base);

  const bids = [];
  const asks = [];

  // Generate 20 levels on each side
  for (let i = 0; i < 20; i++) {
    // Bids (buy orders) are below current price
    const bidPrice = basePrice * (1 - 0.001 * i - 0.0005 * Math.random());
    const bidSize = getRandomSize(base, 10);
    bids.push([
      parseFloat(bidPrice.toFixed(getPriceDecimals(base))),
      parseFloat(bidSize.toFixed(getQuantityDecimals(base))),
      parseFloat((bidPrice * bidSize).toFixed(2)),
    ]);

    // Asks (sell orders) are above current price
    const askPrice = basePrice * (1 + 0.001 * i + 0.0005 * Math.random());
    const askSize = getRandomSize(base, 10);
    asks.push([
      parseFloat(askPrice.toFixed(getPriceDecimals(base))),
      parseFloat(askSize.toFixed(getQuantityDecimals(base))),
      parseFloat((askPrice * askSize).toFixed(2)),
    ]);
  }

  return {
    symbol,
    bids,
    asks,
    timestamp: Date.now(),
  };
};

/**
 * Generates mock candlestick data for a symbol and timeframe
 * @param {string} symbol - The trading pair symbol
 * @param {string} timeframe - The chart timeframe (e.g., '1m', '1h', '1d')
 * @param {number} limit - Number of candles to generate
 * @returns {Array} Array of candlestick data
 */
export const generateMockCandlesticks = (
  symbol,
  timeframe = "1h",
  limit = 100,
) => {
  const [base] = symbol.split("/");
  let basePrice = getBasePrice(base);
  const volatility = getVolatility(base);

  const candles = [];
  const now = Date.now();
  let timeframeMs = getTimeframeMs(timeframe);

  // Generate simulated price movement with realistic trend and volatility
  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = now - i * timeframeMs;
    const range = basePrice * volatility;

    const open = basePrice;

    // Simulate random price movement with some trend persistence
    let direction = Math.random() > 0.5 ? 1 : -1;
    const trend = Math.random() * 0.5 + 0.5; // Random value between 0.5 and 1

    const close = open * (1 + direction * trend * volatility * Math.random());
    const high = Math.max(open, close) * (1 + Math.random() * 0.5 * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * 0.5 * volatility);
    const volume = getRandomSize(base, 100) * (1 + Math.random() * 2);

    candles.push({
      timestamp,
      time: new Date(timestamp).toISOString(),
      open: parseFloat(open.toFixed(getPriceDecimals(base))),
      high: parseFloat(high.toFixed(getPriceDecimals(base))),
      low: parseFloat(low.toFixed(getPriceDecimals(base))),
      close: parseFloat(close.toFixed(getPriceDecimals(base))),
      volume: parseFloat(volume.toFixed(getQuantityDecimals(base))),
    });

    // Update the base price for the next candle
    basePrice = close;
  }

  return candles;
};

// Helper functions

function getMinSize(currency) {
  const minSizes = {
    BTC: 0.001,
    ETH: 0.01,
    SOL: 0.1,
    ADA: 1,
    USDT: 1,
    USDC: 1,
    USD: 1,
    BUSD: 1,
  };

  return minSizes[currency] || 0.01;
}

function getPriceDecimals(base) {
  const priceDecimals = {
    BTC: 2,
    ETH: 2,
    SOL: 2,
    ADA: 4,
    DOT: 3,
    AVAX: 2,
    MATIC: 4,
    XRP: 4,
    BNB: 2,
    LINK: 3,
  };

  return priceDecimals[base] || 2;
}

function getQuantityDecimals(base) {
  const quantityDecimals = {
    BTC: 5,
    ETH: 4,
    SOL: 2,
    ADA: 1,
    DOT: 2,
    AVAX: 2,
    MATIC: 1,
    XRP: 1,
    BNB: 3,
    LINK: 2,
  };

  return quantityDecimals[base] || 2;
}

function getRandomSize(base, multiplier = 1) {
  const baseSizes = {
    BTC: 0.1 + Math.random() * 0.5,
    ETH: 1 + Math.random() * 5,
    SOL: 10 + Math.random() * 50,
    ADA: 100 + Math.random() * 500,
    DOT: 10 + Math.random() * 50,
    AVAX: 5 + Math.random() * 25,
    MATIC: 100 + Math.random() * 500,
    XRP: 100 + Math.random() * 500,
    BNB: 1 + Math.random() * 5,
    LINK: 10 + Math.random() * 50,
  };

  return (baseSizes[base] || 10) * multiplier;
}

function getVolatility(base) {
  const volatilities = {
    BTC: 0.015,
    ETH: 0.02,
    SOL: 0.03,
    ADA: 0.025,
    DOT: 0.025,
    AVAX: 0.03,
    MATIC: 0.03,
    XRP: 0.02,
    BNB: 0.02,
    LINK: 0.025,
  };

  return volatilities[base] || 0.02;
}

function getTimeframeMs(timeframe) {
  const timeframes = {
    "1m": 60 * 1000,
    "5m": 5 * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "30m": 30 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "4h": 4 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
    "1M": 30 * 24 * 60 * 60 * 1000,
  };

  return timeframes[timeframe] || 60 * 60 * 1000; // Default to 1h
}
