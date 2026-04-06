pipeline {
    agent any

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
                        dir('backend') {
                            bat 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Installing frontend dependencies...'
                        dir('frontend') {
                            bat 'npm install'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Building React frontend...'
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker images...'
                bat 'docker-compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying with Docker Compose...'
                
                // Copy the local .env files since they are gitignored
                bat 'copy "C:\\Users\\arsha\\Desktop\\MedOps\\backend\\.env" backend\\.env'
                bat 'copy "C:\\Users\\arsha\\Desktop\\MedOps\\frontend\\.env" frontend\\.env'

                bat 'docker-compose down || true'
                bat 'docker-compose up -d'
                echo '✅ MedOps deployed successfully!'
            }
        }
        stage('Sync Static Files to S3') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
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
