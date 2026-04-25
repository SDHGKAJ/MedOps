# Selenium Testing - Quick Start Guide

## Installation Complete ✓

Selenium testing has been successfully added to your MedOps project!

## What Was Added

### 📦 Packages Installed
- **selenium-webdriver**: Browser automation framework
- **chromedriver**: Chrome WebDriver for automated testing
- **jest**: Testing framework (backend)
- **supertest**: HTTP assertion library (backend)

### 📁 Files Created

**Test Files:**
- `backend/tests/api.test.js` - API endpoint tests using Jest & Supertest
- `backend/tests/e2e.test.js` - End-to-end workflow tests using Selenium
- `frontend/tests/e2e.js` - Frontend UI tests using Selenium

**Configuration:**
- `selenium.config.js` - Shared test configuration and constants
- `SELENIUM_TESTING_GUIDE.md` - Comprehensive testing documentation

### 🔧 Updated Files
- `backend/package.json` - Added test dependencies and scripts
- `frontend/package.json` - Added E2E test script

## Quick Start

### 1. Start Your Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 2. Run Tests

**Backend API Tests:**
```bash
cd backend
npm test
```

**Backend E2E Tests:**
```bash
cd backend
npm run test:e2e
```

**Frontend E2E Tests:**
```bash
cd frontend
npm run test:e2e
```

## Test Coverage

### Frontend E2E Tests (`frontend/tests/e2e.js`)
- ✓ User login
- ✓ View medicines
- ✓ Place orders
- ✓ View orders
- ✓ User logout

### Backend API Tests (`backend/tests/api.test.js`)
- ✓ User registration & login
- ✓ Medicine CRUD operations
- ✓ Order management
- ✓ Authorization checks

### Backend E2E Tests (`backend/tests/e2e.test.js`)
- ✓ Complete user journey (register → login → order → logout)
- ✓ Admin inventory management

## Key Features

✨ **Comprehensive Testing**
- End-to-end UI automation
- API endpoint testing
- User journey workflows
- Authorization & security tests

🎯 **Easy Integration**
- Simple npm scripts
- Pre-built test cases
- Configuration file for customization
- Well-documented code

🚀 **Production Ready**
- Error handling
- Timeout management
- Retry mechanisms
- Detailed logging

## Customization

### Using the Configuration File

Edit `selenium.config.js` to customize:

```javascript
// Change browser behavior
driver: {
  headless: true  // Run without opening browser
}

// Modify timeouts
timeouts: {
  implicit: 15000
}

// Add test users
testUsers: {
  newRole: {
    email: 'user@example.com',
    password: 'pass123'
  }
}
```

### Adding New Tests

**For Frontend:**
```javascript
// Add to frontend/tests/e2e.js
async function testNewFeature() {
  await driver.get(`${BASE_URL}/new-page`);
  // Your test logic
}
```

**For Backend API:**
```javascript
// Add to backend/tests/api.test.js
test('POST /api/new-endpoint - Should work', async () => {
  const res = await request(app)
    .post('/api/new-endpoint')
    .send({ data: 'value' });
  expect(res.status).toBe(200);
});
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Chrome not found | Update ChromeDriver: `npm update chromedriver` |
| Tests timeout | Increase timeout in `selenium.config.js` |
| Element not found | Ensure servers are running and page is loaded |
| Permission denied | Run with admin privileges or use headless mode |

## Next Steps

1. **Review the tests** - Open the test files to understand the structure
2. **Run the tests** - Execute tests to see them in action
3. **Customize** - Modify `selenium.config.js` for your needs
4. **Add more tests** - Create tests for your specific features
5. **Integrate with CI/CD** - Set up automated testing in your pipeline

## Documentation

For detailed information, see:
- [SELENIUM_TESTING_GUIDE.md](./SELENIUM_TESTING_GUIDE.md) - Complete testing guide
- [selenium.config.js](./selenium.config.js) - Configuration reference

## Performance Tips

- 🏃 **Use headless mode** for faster execution
- ⚡ **Parallel execution** for multiple tests
- 🧹 **Clean test data** between runs
- 📊 **Mock external APIs** when possible

## Support & Resources

- [Selenium Documentation](https://www.selenium.dev/)
- [Jest Documentation](https://jestjs.io/)
- [WebDriver API](https://selenium.dev/webdriver/)

---

**Ready to test?** Run `npm test` in the backend directory to get started! 🎉
