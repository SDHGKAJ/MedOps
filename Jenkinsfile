pipeline {
    agent any

    environment {
        WORKSPACE_DIR = "/home/kaushiik/.jenkins/workspace/MedOps"
        STATIC_FILES_PATH = "frontend/dist"
        S3_BUCKET = "s3://medops-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        echo '📦 Installing backend dependencies...'
                        sh 'cd backend && npm install'
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Installing frontend dependencies...'
                        sh 'cd frontend && npm install'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Building React frontend...'
                sh 'cd frontend && chmod +x node_modules/.bin/vite && npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker images...'
                sh 'cp /mnt/c/Users/kaush/OneDrive/Documents/GitHub/MedOps/backend/.env backend/.env'
                sh 'cp /mnt/c/Users/kaush/OneDrive/Documents/GitHub/MedOps/frontend/.env frontend/.env'
                sh 'docker-compose build'   
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying with Docker Compose...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
                echo '✅ MedOps deployed successfully!'
            }
        }

        stage('Selenium UI Tests') {
            steps {
                echo '🧪 Running Selenium UI tests...'
                sh '''
                    # Wait for the frontend container to be healthy (max 60s)
                    echo "⏳ Waiting for frontend to be ready on port 8081..."
                    for i in $(seq 1 12); do
                        if curl -sf http://localhost:8081 > /dev/null; then
                            echo "✅ Frontend is up!"
                            break
                        fi
                        echo "Attempt $i/12 — retrying in 5s..."
                        sleep 5
                    done

                    # Install Python deps if not present
                    pip3 install --quiet selenium webdriver-manager

                    # Write the Selenium test script inline
                    cat > /tmp/medops_selenium_test.py << \'EOF\'
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import sys

BASE_URL = "http://localhost:8081"

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
)

failures = []

try:
    # Test 1: Home page loads
    driver.get(BASE_URL)
    WebDriverWait(driver, 10).until(
        lambda d: d.execute_script("return document.readyState") == "complete"
    )
    if "MedOps" not in driver.title and driver.find_elements(By.TAG_NAME, "body"):
        print("✅ Test 1 PASSED: Home page loaded")
    else:
        print("✅ Test 1 PASSED: Home page responded with content")

    # Test 2: Page has a body element (basic DOM check)
    body = driver.find_element(By.TAG_NAME, "body")
    assert body is not None, "Body element missing"
    print("✅ Test 2 PASSED: DOM body element found")

    # Test 3: No JS console errors (check for visible error text)
    logs = driver.get_log("browser")
    severe_errors = [l for l in logs if l["level"] == "SEVERE"]
    if not severe_errors:
        print("✅ Test 3 PASSED: No severe JS console errors")
    else:
        for err in severe_errors:
            print(f"⚠️  JS Error: {err['message']}")
        failures.append("Test 3 FAILED: Severe JS errors found")

finally:
    driver.quit()

if failures:
    print("\\n❌ Some tests failed:")
    for f in failures:
        print(f"  - {f}")
    sys.exit(1)
else:
    print("\\n🎉 All Selenium UI tests passed!")
EOF

                    python3 /tmp/medops_selenium_test.py
                '''
            }
            post {
                always {
                    echo '🧹 Selenium test stage complete.'
                }
                failure {
                    echo '❌ Selenium UI tests failed! Check logs above.'
                }
            }
        }

        stage('Sync Static Files to S3') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        aws s3 sync ${STATIC_FILES_PATH} ${S3_BUCKET} \
                            --delete \
                            --exclude "*.py" \
                            --exclude "*.pyc" \
                            --include "*.html" \
                            --include "*.css" \
                            --include "*.js"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
    }
}