pipeline {
    agent any

    // Variables globales du pipeline
    environment {
        NEXUS_URL        = "192.168.56.10:8082"
        NEXUS_CREDENTIAL = credentials('nexus-credentials')
        KUBECONFIG_FILE  = credentials('kubeconfig')
        SONAR_TOKEN      = credentials('sonarqube-token')
    }

    stages {

        // ── ÉTAPE 1 : Récupérer le code ──────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Récupération du code source...'
                checkout scm
            }
        }

        // ── ÉTAPE 2 : Analyse SonarQube ──────────────────────
        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Analyse qualité du code...'
                withSonarQubeEnv('sonarqube') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=k8s-microservices \
                          -Dsonar.projectName="K8s Microservices" \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=**/node_modules/**,**/k8s/**
                    '''
                }
            }
        }

        // ── ÉTAPE 3 : Quality Gate ────────────────────────────
        stage('Quality Gate') {
            steps {
                echo '✅ Vérification Quality Gate...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ── ÉTAPE 4 : Build Images Docker ────────────────────
        stage('Build Docker Images') {
            steps {
                echo '🐳 Build des images Docker...'
                sh '''
                    docker build -t ${NEXUS_URL}/frontend:${BUILD_NUMBER} \
                                 -t ${NEXUS_URL}/frontend:latest \
                                 ./frontend

                    docker build -t ${NEXUS_URL}/service-users:${BUILD_NUMBER} \
                                 -t ${NEXUS_URL}/service-users:latest \
                                 ./service-users

                    docker build -t ${NEXUS_URL}/service-products:${BUILD_NUMBER} \
                                 -t ${NEXUS_URL}/service-products:latest \
                                 ./service-products
                '''
            }
        }

        // ── ÉTAPE 5 : Push vers Nexus ─────────────────────────
        stage('Push to Nexus') {
            steps {
                echo '📦 Push des images vers Nexus...'
                sh '''
                    echo ${NEXUS_CREDENTIAL_PSW} | \
                    docker login ${NEXUS_URL} \
                      -u ${NEXUS_CREDENTIAL_USR} \
                      --password-stdin

                    docker push ${NEXUS_URL}/frontend:${BUILD_NUMBER}
                    docker push ${NEXUS_URL}/frontend:latest

                    docker push ${NEXUS_URL}/service-users:${BUILD_NUMBER}
                    docker push ${NEXUS_URL}/service-users:latest

                    docker push ${NEXUS_URL}/service-products:${BUILD_NUMBER}
                    docker push ${NEXUS_URL}/service-products:latest
                '''
            }
        }

        // ── ÉTAPE 6 : Deploy sur Recette ─────────────────────
        stage('Deploy to Recette') {
            steps {
                echo '🚀 Déploiement sur Recette...'
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh '''
                        kubectl apply -k frontend/k8s/overlays/recette
                        kubectl apply -k service-users/k8s/overlays/recette
                        kubectl apply -k service-products/k8s/overlays/recette
                        kubectl apply -k k8s-global/overlays/recette

                        # Attendre que les déploiements soient prêts
                        kubectl rollout status deployment/frontend -n recette
                        kubectl rollout status deployment/service-users -n recette
                        kubectl rollout status deployment/service-products -n recette
                    '''
                }
            }
        }

        // ── ÉTAPE 7 : Validation manuelle avant Prod ─────────
        stage('Approval before Prod') {
            steps {
                echo '⏸️ En attente de validation...'
                timeout(time: 30, unit: 'MINUTES') {
                    input message: '🚀 Déployer en PRODUCTION ?',
                          ok: 'Oui, déployer !'
                }
            }
        }

        // ── ÉTAPE 8 : Deploy sur Prod ─────────────────────────
        stage('Deploy to Prod') {
            steps {
                echo '🚀 Déploiement en Production...'
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh '''
                        kubectl apply -k frontend/k8s/overlays/prod
                        kubectl apply -k service-users/k8s/overlays/prod
                        kubectl apply -k service-products/k8s/overlays/prod
                        kubectl apply -k k8s-global/overlays/prod

                        kubectl rollout status deployment/frontend -n prod
                        kubectl rollout status deployment/service-users -n prod
                        kubectl rollout status deployment/service-products -n prod
                    '''
                }
            }
        }
    }

    // ── Actions après le pipeline ─────────────────────────────
    post {
        success {
            echo '✅ Pipeline terminé avec succès !'
        }
        failure {
            echo '❌ Pipeline échoué !'
        }
        always {
            // Nettoyer les images Docker locales
            sh 'docker image prune -f'
        }
    }
}