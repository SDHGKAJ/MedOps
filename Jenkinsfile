pipeline {
    agent any

    environment {
        STATIC_FILES_PATH = "frontend\\dist"
        S3_BUCKET         = "s3://medops-frontend"
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
                        bat 'cd backend && npm install'
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Installing frontend dependencies...'
                        bat 'cd frontend && npm install'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Building React frontend...'
                bat 'cd frontend && npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker images...'
                bat 'copy /Y "C:\\Users\\kaush\\OneDrive\\Documents\\GitHub\\MedOps\\backend\\.env" "backend\\.env"'
                bat 'copy /Y "C:\\Users\\kaush\\OneDrive\\Documents\\GitHub\\MedOps\\frontend\\.env" "frontend\\.env"'
                bat 'docker-compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying with Docker Compose...'
                bat 'docker-compose down || exit 0'
                bat 'docker-compose up -d'
                echo '✅ MedOps deployed successfully!'
            }
        }

        stage('Selenium UI Tests') {
            steps {
                echo '🧪 Running Selenium UI tests...'
                powershell '''
                    # Wait for frontend on port 8081 (max 60s)
                    Write-Host "⏳ Waiting for frontend on port 8081..."
                    $ready = $false
                    for ($i = 1; $i -le 12; $i++) {
                        try {
                            $resp = Invoke-WebRequest -Uri "http://localhost:8081" -UseBasicParsing -TimeoutSec 5
                            if ($resp.StatusCode -eq 200) {
                                Write-Host "✅ Frontend is up!"
                                $ready = $true
                                break
                            }
                        } catch {
                            Write-Host "Attempt $i/12 — retrying in 5s..."
                            Start-Sleep -Seconds 5
                        }
                    }
                    if (-not $ready) {
                        Write-Host "❌ Frontend did not come up in time!"
                        exit 1
                    }

                    # Install Selenium and webdriver-manager
                    pip install --quiet selenium webdriver-manager

                    # Write the Selenium test script
                    $testScript = @"
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
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
    print("✅ Test 1 PASSED: Home page loaded")

    # Test 2: DOM body element exists
    body = driver.find_element(By.TAG_NAME, "body")
    assert body is not None, "Body element missing"
    print("✅ Test 2 PASSED: DOM body element found")

    # Test 3: No severe JS console errors
    logs = driver.get_log("browser")
    severe = [l for l in logs if l["level"] == "SEVERE"]
    if not severe:
        print("✅ Test 3 PASSED: No severe JS console errors")
    else:
        for err in severe:
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
"@

                    $testScript | Out-File -FilePath "$env:TEMP\\medops_selenium_test.py" -Encoding utf8
                    python "$env:TEMP\\medops_selenium_test.py"
                    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
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
                    powershell '''
                        $env:AWS_ACCESS_KEY_ID     = $env:AWS_ACCESS_KEY_ID
                        $env:AWS_SECRET_ACCESS_KEY = $env:AWS_SECRET_ACCESS_KEY
                        aws s3 sync $env:STATIC_FILES_PATH $env:S3_BUCKET `
                            --delete `
                            --exclude "*.py" `
                            --exclude "*.pyc" `
                            --include "*.html" `
                            --include "*.css" `
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