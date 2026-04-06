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
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Installing frontend dependencies...'
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Building React frontend...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker images...'
                sh 'docker-compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying with Docker Compose...'
                sh 'cp /mnt/c/Users/kaush/OneDrive/Documents/GitHub/MedOps/backend/.env backend/.env'
                sh 'cp /mnt/c/Users/kaush/OneDrive/Documents/GitHub/MedOps/frontend/.env frontend/.env'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
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