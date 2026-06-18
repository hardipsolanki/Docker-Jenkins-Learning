pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
             echo 'Builing the application'
             echo "${env.BRANCH_NAME}"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing the application'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application'
                echo 'Building the application with maven'
            }
        }
    }
}
node {

}