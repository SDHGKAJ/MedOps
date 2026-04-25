/**
 * Selenium Test Configuration
 * Shared configuration for all Selenium tests
 */

module.exports = {
  // Driver Configuration
  driver: {
    browser: 'chrome',
    headless: false,  // Set to true for CI/CD environments
    windowSize: {
      width: 1920,
      height: 1080
    }
  },

  // Timeout Configuration
  timeouts: {
    implicit: 10000,      // Element location timeout
    explicit: 15000,      // Element wait timeout
    pageLoad: 30000,      // Page load timeout
    script: 10000         // Script execution timeout
  },

  // URLs
  urls: {
    frontend: 'http://localhost:5173',
    backend: 'http://localhost:3001',
    api: 'http://localhost:3001/api'
  },

  // Test User Credentials
  testUsers: {
    admin: {
      email: 'admin@pharmacy.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    },
    pharmacist: {
      email: 'pharmacist@pharmacy.com',
      password: 'pharmacist123',
      name: 'Pharmacist User',
      role: 'pharmacist'
    },
    customer: {
      email: 'customer@pharmacy.com',
      password: 'customer123',
      name: 'Customer User',
      role: 'customer'
    }
  },

  // Test Data
  testData: {
    medicine: {
      name: 'Test Medicine',
      dosage: '500mg',
      price: 100,
      quantity: 50,
      manufacturer: 'Test Pharma'
    },
    order: {
      quantity: 5,
      totalAmount: 500
    }
  },

  // Selectors (Common Element Locators)
  selectors: {
    auth: {
      emailInput: 'input[name="email"]',
      passwordInput: 'input[name="password"]',
      nameInput: 'input[name="name"]',
      loginButton: 'button[type="submit"]',
      registerLink: 'a.register-link',
      loginLink: 'a.login-link'
    },
    medicine: {
      medicineCard: '.medicine-card',
      medicineList: '.medicine-list',
      medicineSelect: 'select[name="medicine"]',
      priceDisplay: '.medicine-price',
      addMedicineBtn: '.add-medicine-btn'
    },
    order: {
      orderForm: '#order-form',
      quantityInput: 'input[name="quantity"]',
      submitButton: 'button[type="submit"]',
      orderRow: '.order-row',
      orderList: '.order-list',
      statusSelect: 'select[name="status"]'
    },
    navigation: {
      header: 'header',
      logoutBtn: '.logout-btn',
      dashboardLink: 'a[href="/dashboard"]',
      medicinesLink: 'a[href="/medicines"]',
      ordersLink: 'a[href="/orders"]'
    }
  },

  // Logging Configuration
  logging: {
    level: 'info',  // 'debug', 'info', 'warn', 'error'
    file: 'test-logs.txt'
  },

  // Report Configuration
  reporting: {
    format: 'json',  // 'json', 'html', 'junit'
    outputDir: './test-results',
    screenshots: true,
    screenshotOnFailure: true
  },

  // Retry Configuration
  retries: {
    maxAttempts: 3,
    delayBetweenAttempts: 1000  // ms
  }
};
