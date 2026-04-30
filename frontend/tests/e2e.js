import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

const BASE_URL = 'http://localhost:5173';
const TIMEOUT = 15000;
let driver;

const testData = {
    user: {
        email: 'john@example.com',
        password: '1234'
    },
    admin: {
        email: 'admin1@pharmacy.com',
        password: '12345'
    }
};

async function setupDriver() {
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    await driver.manage().setTimeouts({ implicit: TIMEOUT });
}

async function teardownDriver() {
    if (driver) await driver.quit();
}

async function testLogin() {
    console.log('Testing Login...');
    try {
        await driver.get(`${BASE_URL}/login`);
        await driver.sleep(1000);
        const emailInput = await driver.wait(
            until.elementLocated(By.name('email')),
            TIMEOUT
        );
        await emailInput.sendKeys(testData.user.email);
        const passwordInput = await driver.findElement(By.name('password'));
        await passwordInput.sendKeys(testData.user.password);
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));
        await loginButton.click();
        await driver.wait(until.urlContains('/login#dashboard'), TIMEOUT);
        console.log('✓ Login test passed');
    } catch (error) {
        console.error('✗ Login test failed:', error.message);
        throw error;
    }
}

async function testViewMedicines() {
    console.log('Testing View Medicines...');
    try {
        await driver.sleep(1000);
        const medicinesBtn = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'Medicines') or contains(text(), 'To Do')]")),
            TIMEOUT
        );
        await medicinesBtn.click();
        await driver.sleep(2000);
        console.log('✓ View medicines test passed');
    } catch (error) {
        console.error('✗ View medicines test failed:', error.message);
        throw error;
    }
}

async function testViewOrders() {
    console.log('Testing View Orders...');
    try {
        await driver.get(`${BASE_URL}/login#dashboard`);
        await driver.sleep(1000);
        // Click the "To Do" button inside the Orders card specifically
        const orderButtons = await driver.findElements(By.css('button, .btn'));
        for (let btn of orderButtons) {
            const text = await btn.getText();
            if (text.includes('To Do') || text.includes('Order')) {
                await driver.executeScript('arguments[0].click();', btn);
                break;
            }
        }
        await driver.sleep(2000);
        console.log('✓ View orders test passed');
    } catch (error) {
        console.error('✗ View orders test failed:', error.message);
        throw error;
    }
}

async function testLogout() {
    console.log('Testing Logout...');
    try {
        await driver.sleep(1000);
        const logoutButton = await driver.wait(
            until.elementLocated(By.className('logout-btn')),
            TIMEOUT
        );
        await driver.executeScript('arguments[0].click();', logoutButton);
        await driver.wait(until.urlContains('/login'), TIMEOUT);
        console.log('✓ Logout test passed');
    } catch (error) {
        console.error('✗ Logout test failed:', error.message);
        throw error;
    }
}

async function runAllTests() {
    try {
        await setupDriver();
        console.log('Starting Frontend E2E Tests\n');
        await testLogin();
        await testViewMedicines();
        await testViewOrders();
        await testLogout();
        console.log('\n✓ All frontend tests completed successfully!');
    } catch (error) {
        console.error('\n✗ Test suite failed:', error.message);
        process.exit(1);
    } finally {
        await teardownDriver();
    }
}

runAllTests();

export { testLogin, testViewMedicines, testViewOrders, testLogout, setupDriver, teardownDriver };