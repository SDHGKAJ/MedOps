# Selenium Testing Guide for MedOps

This document explains how to set up and run Selenium tests in the MedOps project.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Chrome/Chromium browser
- Backend and Frontend servers running

### Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

## Test Structure

### Frontend E2E Tests (`frontend/tests/e2e.js`)

Browser automation tests using Selenium WebDriver. Tests include:

- **Login**: User authentication workflow
- **View Medicines**: Display medicine catalog
- **Place Order**: Create and submit orders
- **View Orders**: Display user orders
- **Logout**: User session termination

#### Run Frontend E2E Tests:
```bash
cd frontend
npm run test:e2e
```

### Backend API Tests (`backend/tests/api.test.js`)

API endpoint testing using Jest and Supertest. Tests include:

- **Authentication**: Register, Login, Token validation
- **Medicines**: CRUD operations (Create, Read, Update, Delete)
- **Orders**: Order management operations
- **Authorization**: Token-based access control

#### Run Backend API Tests:
```bash
cd backend
npm test
```

### Backend E2E Tests (`backend/tests/e2e.test.js`)

End-to-end workflow tests using Selenium. Tests include:

- **Complete User Journey**: Full user workflow from registration to checkout
- **Admin Inventory Management**: Inventory operations and medicine management

#### Run Backend E2E Tests:
```bash
cd backend
npm run test:e2e
```

## Configuration

### Environment Setup

Ensure your `.env` files are configured:

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/medops
JWT_SECRET=your_jwt_secret_key
PORT=3001
NODE_ENV=test
```

**Frontend (.env.local):**
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Selenium Configuration

Selenium tests use Chrome WebDriver. To run tests headless (without opening browser):

Edit the test file and uncomment:
```javascript
// options.addArguments('--headless');
```

## Running All Tests

### Sequential Execution
```bash
# Run all backend tests
cd backend
npm test              # API tests
npm run test:e2e      # E2E tests

# Run all frontend tests
cd frontend
npm run test:e2e      # E2E tests
```

### Parallel Execution (with proper setup)
```bash
# Run multiple test suites simultaneously in separate terminals
# Terminal 1: Backend API tests
npm test

# Terminal 2: Frontend E2E tests
npm run test:e2e

# Terminal 3: Backend E2E tests
npm run test:e2e
```

## Test Best Practices

### 1. Wait for Elements
Use explicit waits instead of implicit delays:
```javascript
const element = await driver.wait(
  until.elementLocated(By.id('elementId')),
  10000  // timeout in ms
);
```

### 2. Handle Async Operations
Always await driver operations:
```javascript
await driver.get(url);
await element.click();
```

### 3. Clean Up
Ensure driver cleanup in tests:
```javascript
await driver.quit();
```

### 4. Test Data Management
Use consistent test data and clean up after tests:
```javascript
const testUser = {
  email: 'test@pharmacy.com',
  password: 'password123'
};
```

### 5. Error Handling
Implement proper error handling:
```javascript
try {
  await testFunction();
} catch (error) {
  console.error('Test failed:', error.message);
  throw error;
}
```

## Troubleshooting

### ChromeDriver Issues
- Ensure ChromeDriver version matches your Chrome version
- Update ChromeDriver: `npm update chromedriver`

### Timeout Errors
- Increase timeout in test configuration
- Ensure development servers are running
- Check browser console for JavaScript errors

### Element Not Found
- Use explicit waits with proper selectors
- Verify elements exist in DOM before interaction
- Check for dynamic content loading

### Authentication Issues
- Ensure test user accounts exist in database
- Verify JWT token configuration
- Check API endpoint accessibility

## Adding New Tests

### Frontend Test Template
```javascript
async function testNewFeature() {
  console.log('Testing New Feature...');
  try {
    await driver.get(`${BASE_URL}/path`);
    
    // Your test logic here
    const element = await driver.wait(
      until.elementLocated(By.id('someId')),
      TIMEOUT
    );
    
    console.log('✓ New feature test passed');
  } catch (error) {
    console.error('✗ New feature test failed:', error.message);
    throw error;
  }
}
```

### Backend API Test Template
```javascript
test('POST /api/endpoint - Should do something', async () => {
  const res = await request(app)
    .post('/api/endpoint')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ data: 'value' });
  
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('expectedField');
});
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Run Selenium Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
```

## Performance Tips

1. **Parallel Execution**: Run independent tests in parallel
2. **Headless Mode**: Faster execution with headless browsers
3. **Test Isolation**: Independent tests for better debugging
4. **Database Cleanup**: Clear test data between runs
5. **Network Mocking**: Mock API calls for speed

## Additional Resources

- [Selenium WebDriver Documentation](https://selenium.dev/documentation/webdriver/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

## Support

For issues or questions:
1. Check test logs for error messages
2. Review browser console output
3. Verify all prerequisites are installed
4. Check test database connectivity
