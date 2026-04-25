/**
 * Backend E2E Tests using Selenium WebDriver
 * Tests complete workflows from API perspective
 */

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001/api';

const TIMEOUT = 15000;
let driver;

// Test data
const testData = {
  user: {
    email: 'e2etest@pharmacy.com',
    password: 'test123456',
    name: 'E2E Test User'
  },
  medicine: {
    name: 'Paracetamol',
    dosage: '500mg',
    price: 30,
    quantity: 200
  }
};

async function setupDriver() {
  const options = new chrome.Options();
  // options.addArguments('--headless');
  
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  await driver.manage().setTimeouts({ implicit: TIMEOUT });
}

async function teardownDriver() {
  if (driver) {
    await driver.quit();
  }
}

// E2E Test: Complete User Journey
async function testCompleteUserJourney() {
  console.log('Running Complete User Journey E2E Test...');
  
  try {
    // Step 1: Register new user
    console.log('  Step 1: Registering user...');
    await driver.get(`${BASE_URL}/register`);
    
    const nameInput = await driver.wait(
      until.elementLocated(By.name('name')),
      TIMEOUT
    );
    await nameInput.sendKeys(testData.user.name);
    
    const emailInput = await driver.findElement(By.name('email'));
    await emailInput.sendKeys(testData.user.email);
    
    const passwordInput = await driver.findElement(By.name('password'));
    await passwordInput.sendKeys(testData.user.password);
    
    const registerButton = await driver.findElement(By.css('button[type="submit"]'));
    await registerButton.click();
    
    await driver.wait(until.urlContains('/login'), TIMEOUT);
    console.log('  ✓ User registered');
    
    // Step 2: Login
    console.log('  Step 2: Logging in...');
    const loginEmailInput = await driver.findElement(By.name('email'));
    await loginEmailInput.sendKeys(testData.user.email);
    
    const loginPasswordInput = await driver.findElement(By.name('password'));
    await loginPasswordInput.sendKeys(testData.user.password);
    
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await loginButton.click();
    
    await driver.wait(until.urlContains('/dashboard'), TIMEOUT);
    console.log('  ✓ User logged in');
    
    // Step 3: View medicines
    console.log('  Step 3: Viewing medicines...');
    const medicinesLink = await driver.findElement(By.linkText('Medicines'));
    await medicinesLink.click();
    
    await driver.wait(
      until.elementLocated(By.className('medicine-card')),
      TIMEOUT
    );
    console.log('  ✓ Medicines loaded');
    
    // Step 4: Place order
    console.log('  Step 4: Placing order...');
    const ordersLink = await driver.findElement(By.linkText('Orders'));
    await ordersLink.click();
    
    const medicineSelect = await driver.wait(
      until.elementLocated(By.name('medicine')),
      TIMEOUT
    );
    await medicineSelect.click();
    
    const medicineOption = await driver.findElement(By.css('select[name="medicine"] option:nth-child(2)'));
    await medicineOption.click();
    
    const quantityInput = await driver.findElement(By.name('quantity'));
    await quantityInput.clear();
    await quantityInput.sendKeys('10');
    
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();
    
    await driver.wait(
      until.elementLocated(By.className('success-message')),
      TIMEOUT
    );
    console.log('  ✓ Order placed');
    
    // Step 5: View orders
    console.log('  Step 5: Viewing orders...');
    const ordersViewLink = await driver.findElement(By.linkText('My Orders'));
    await ordersViewLink.click();
    
    await driver.wait(
      until.elementLocated(By.className('order-row')),
      TIMEOUT
    );
    console.log('  ✓ Orders displayed');
    
    // Step 6: Logout
    console.log('  Step 6: Logging out...');
    const logoutButton = await driver.findElement(By.className('logout-btn'));
    await logoutButton.click();
    
    await driver.wait(until.urlContains('/login'), TIMEOUT);
    console.log('  ✓ User logged out');
    
    console.log('\n✓ Complete User Journey E2E Test PASSED\n');
  } catch (error) {
    console.error('\n✗ Complete User Journey E2E Test FAILED:', error.message);
    throw error;
  }
}

// E2E Test: Admin Inventory Management
async function testAdminInventoryManagement() {
  console.log('Running Admin Inventory Management E2E Test...');
  
  try {
    // Login as admin
    console.log('  Step 1: Admin login...');
    await driver.get(`${BASE_URL}/login`);
    
    const emailInput = await driver.wait(
      until.elementLocated(By.name('email')),
      TIMEOUT
    );
    await emailInput.sendKeys('admin@pharmacy.com');
    
    const passwordInput = await driver.findElement(By.name('password'));
    await passwordInput.sendKeys('admin123');
    
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await loginButton.click();
    
    await driver.wait(until.urlContains('/dashboard'), TIMEOUT);
    console.log('  ✓ Admin logged in');
    
    // Navigate to inventory
    console.log('  Step 2: Accessing inventory management...');
    const inventoryLink = await driver.findElement(By.linkText('Inventory'));
    await inventoryLink.click();
    
    await driver.wait(
      until.elementLocated(By.className('medicine-card')),
      TIMEOUT
    );
    console.log('  ✓ Inventory page loaded');
    
    // Add new medicine
    console.log('  Step 3: Adding new medicine...');
    const addButton = await driver.findElement(By.className('add-medicine-btn'));
    await addButton.click();
    
    const medicineNameInput = await driver.wait(
      until.elementLocated(By.name('medicineName')),
      TIMEOUT
    );
    await medicineNameInput.sendKeys(testData.medicine.name);
    
    const dosageInput = await driver.findElement(By.name('dosage'));
    await dosageInput.sendKeys(testData.medicine.dosage);
    
    const priceInput = await driver.findElement(By.name('price'));
    await priceInput.sendKeys(testData.medicine.price);
    
    const quantityInput = await driver.findElement(By.name('quantity'));
    await quantityInput.sendKeys(testData.medicine.quantity);
    
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();
    
    await driver.wait(
      until.elementLocated(By.className('success-message')),
      TIMEOUT
    );
    console.log('  ✓ Medicine added');
    
    console.log('\n✓ Admin Inventory Management E2E Test PASSED\n');
  } catch (error) {
    console.error('\n✗ Admin Inventory Management E2E Test FAILED:', error.message);
    throw error;
  }
}

// Run all E2E tests
async function runAllE2ETests() {
  try {
    await setupDriver();
    console.log('Starting Backend E2E Tests\n');
    
    await testCompleteUserJourney();
    await testAdminInventoryManagement();
    
    console.log('✓ All E2E tests completed successfully!');
  } catch (error) {
    console.error('\n✗ E2E test suite failed:', error.message);
    process.exit(1);
  } finally {
    await teardownDriver();
  }
}

// Run if executed directly
runAllE2ETests();

export {
  testCompleteUserJourney,
  testAdminInventoryManagement,
  setupDriver,
  teardownDriver
};
