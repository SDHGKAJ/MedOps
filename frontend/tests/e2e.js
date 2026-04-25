/**
 * Frontend E2E Tests using Selenium WebDriver
 * Tests user interactions with the MedOps application
 */

import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const BASE_URL = 'http://localhost:5173'; // Vite dev server

// Test Configuration
const TIMEOUT = 10000;
let driver;

// Test Utilities
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setupDriver() {
  const options = new chrome.Options();
  // Uncomment for headless mode
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

// Login Test
async function testLogin() {
  console.log('Testing Login...');
  try {
    await driver.get(`${BASE_URL}/login`);
    
    // Find and fill email field
    const emailInput = await driver.findElement(By.name('email'));
    await emailInput.sendKeys('admin@pharmacy.com');
    
    // Find and fill password field
    const passwordInput = await driver.findElement(By.name('password'));
    await passwordInput.sendKeys('password123');
    
    // Click login button
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await loginButton.click();
    
    // Wait for navigation or dashboard to appear
    await driver.wait(until.urlContains('/dashboard'), TIMEOUT);
    console.log('✓ Login test passed');
  } catch (error) {
    console.error('✗ Login test failed:', error.message);
    throw error;
  }
}

// View Medicines Test
async function testViewMedicines() {
  console.log('Testing View Medicines...');
  try {
    await driver.get(`${BASE_URL}/medicines`);
    
    // Wait for medicines list to load
    const medicineList = await driver.wait(
      until.elementLocated(By.className('medicine-card')),
      TIMEOUT
    );
    
    // Verify at least one medicine is displayed
    const medicines = await driver.findElements(By.className('medicine-card'));
    if (medicines.length > 0) {
      console.log(`✓ View medicines test passed - Found ${medicines.length} medicines`);
    } else {
      throw new Error('No medicines found');
    }
  } catch (error) {
    console.error('✗ View medicines test failed:', error.message);
    throw error;
  }
}

// Place Order Test
async function testPlaceOrder() {
  console.log('Testing Place Order...');
  try {
    await driver.get(`${BASE_URL}/orders`);
    
    // Wait for order form
    const orderForm = await driver.wait(
      until.elementLocated(By.id('order-form')),
      TIMEOUT
    );
    
    // Select a medicine
    const medicineSelect = await driver.findElement(By.name('medicine'));
    await medicineSelect.click();
    const firstOption = await driver.findElement(By.css('select[name="medicine"] option:nth-child(2)'));
    await firstOption.click();
    
    // Enter quantity
    const quantityInput = await driver.findElement(By.name('quantity'));
    await quantityInput.clear();
    await quantityInput.sendKeys('5');
    
    // Submit order
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();
    
    // Wait for success message
    const successMessage = await driver.wait(
      until.elementLocated(By.className('success-message')),
      TIMEOUT
    );
    
    console.log('✓ Place order test passed');
  } catch (error) {
    console.error('✗ Place order test failed:', error.message);
    throw error;
  }
}

// View Orders Test
async function testViewOrders() {
  console.log('Testing View Orders...');
  try {
    await driver.get(`${BASE_URL}/orders`);
    
    // Wait for orders list to load
    const orderList = await driver.wait(
      until.elementLocated(By.className('order-row')),
      TIMEOUT
    );
    
    // Verify orders are displayed
    const orders = await driver.findElements(By.className('order-row'));
    console.log(`✓ View orders test passed - Found ${orders.length} orders`);
  } catch (error) {
    console.error('✗ View orders test failed:', error.message);
    throw error;
  }
}

// Logout Test
async function testLogout() {
  console.log('Testing Logout...');
  try {
    const logoutButton = await driver.findElement(By.className('logout-btn'));
    await logoutButton.click();
    
    // Wait for redirect to login page
    await driver.wait(until.urlContains('/login'), TIMEOUT);
    console.log('✓ Logout test passed');
  } catch (error) {
    console.error('✗ Logout test failed:', error.message);
    throw error;
  }
}

// Run all tests
async function runAllTests() {
  try {
    await setupDriver();
    console.log('Starting Frontend E2E Tests\n');
    
    // Run tests sequentially
    await testLogin();
    await delay(500);
    
    await testViewMedicines();
    await delay(500);
    
    await testPlaceOrder();
    await delay(500);
    
    await testViewOrders();
    await delay(500);
    
    await testLogout();
    
    console.log('\n✓ All tests completed successfully!');
  } catch (error) {
    console.error('\n✗ Test suite failed:', error.message);
    process.exit(1);
  } finally {
    await teardownDriver();
  }
}

// Run tests if executed directly
runAllTests();

export {
  testLogin,
  testViewMedicines,
  testPlaceOrder,
  testViewOrders,
  testLogout,
  setupDriver,
  teardownDriver
};
