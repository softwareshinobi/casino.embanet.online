pipeline {

    agent none

    options {

        disableConcurrentBuilds(abortPrevious: true)

        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('docker compose build') {

            agent {

                label "sian"

            }

            steps {

                dir('.') {

                    sh 'docker compose build'

                }

            }

        }

        stage('docker compose push') {

            agent {

                label "sian"

            }

            steps {

                dir('.') {

                    sh 'docker compose push'

                }

            }

        }
    }

}
