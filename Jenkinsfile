def githash
def docker_image_name
pipeline {
    agent {label 'master'}
    tools {nodejs "node20.0.0"}

    environment {
        AWS_PROFILE = "jenkins-env"
        PIPELINE_NAME = "${params.PIPELINE_NAME}"
        S3_FOLDER = "jenkins-env-files"
       
    }

    options {
        ansiColor('xterm')
        withCredentials([
            string(credentialsId: 'GITLAB_URL', variable: 'GITLAB_URL'),
            string(credentialsId: 'SHARED_LIBRARY_PATH', variable: 'SHARED_LIBRARY_PATH'),
            string(credentialsId: 'DOCKER_PASSWORD', variable: 'DOCKER_PASSWORD'),
            string(credentialsId: 'DOCKER_LOGIN', variable: 'USERNAME'),
            string(credentialsId: 'GITLAB_AUTH_TOKEN', variable: 'GITLAB_AUTH_TOKEN'),
            string(credentialsId: 'GITLAB_BASE_URL', variable: 'GITLAB_BASE_URL'),
            string(credentialsId: 'INFISICAL_TOKEN', variable: 'INFISICAL_TOKEN'),
            string(credentialsId: 'DOCKER_HUB_USER', variable: 'DOCKER_HUB_USER'),
            string(credentialsId: 'DOCKER_HUB_PAT', variable: 'DOCKER_HUB_PAT')
        ])
    }
    parameters {
        gitParameter branchFilter: 'origin/(.*)', defaultValue: 'main', name: 'Branch', type: 'PT_BRANCH'
    }


    stages {
        stage('Preparation'){
            steps{
                script{
                    try{

                        library identifier: 'jsl@main', retriever: modernSCM(
                        [$class: 'GitSCMSource', remote: "$GITLAB_URL"+"$SHARED_LIBRARY_PATH", credentialsId: 'gitlab-ssh'])
                    
                        sh "rm -rf ./*"
                        download_file_from_s3("${params.ENVIRONMENT}.groovy","${env.AWS_PROFILE}","${env.S3_FOLDER}",true) 
                        load "./${params.ENVIRONMENT}.groovy"                 
                        check_user_access()
                        docker_image_name="${env.pipeline_name}-${env.environment}"
                    
                    }
                    catch(Exception e){
                        echo "FAILED ${e}"
                        throw e
                    }
                }
            }
        }

        stage('Cloning the Project'){
            steps{
                script{
                    try{
                        properties([
                            parameters([
                                gitParameter ( branchFilter: 'origin/(.*)', defaultValue: 'main', name: 'Branch', type: 'PT_BRANCH',  useRepository: "${GITLAB_URL}"+"/"+"${env.GITREPO_PATH}"+".git" ),
                                choice (name: 'ENVIRONMENT', choices: ['development','production']),
                                choice (name: 'PIPELINE_NAME', choices: ['webelight-document-microservice','riddhi-gsp-document'])
                                ])
                        ])
                       
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("warning","Cloning the Project stage started - ${env.PIPELINE_NAME} STARTED-Branch-: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
           
                        echo "flag: ${params.Branch}"
                        echo "flag: ${params.ENVIRONMENT}"
                        git branch: "${params.Branch}", credentialsId: 'gitlab-ssh', url: "${GITLAB_URL}"+"/"+"${env.GITREPO_PATH}"+".git"
                        githash = sh(script: 'git rev-parse --short=8 HEAD', returnStdout: true).trim() 
                    
                    }
                    catch(Exception e)
                    {
                        echo "FAILED ${e}"
                        sendSlackMessage("danger","Failed at Cloning the Project stage - ${env.PIPELINE_NAME}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'" ,"${env.SLACK_SEND_CHANNEL}")  
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }



        stage('Sonarqube Analysis') {
            steps {
                script{
                    try{

                        def sonarConditions = [
                            [env: 'development'],
                            [env: 'production']
                        ]

                        def shouldRunSonarQube = sonarConditions.any { it.env == params.ENVIRONMENT }

                        if (shouldRunSonarQube) {
                            run_sonarqube()
                        }

                    } catch(Exception e) {
                        echo "FAILED ${e}"
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("danger" ,"Failed at Sonarqube Analysis stage - ${env.PIPELINE_NAME}: '${env.JOB_NAME} [${env.BUILD_NUMBER}]' ", "${env.SLACK_SEND_CHANNEL}")
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Building the image') {
            steps {
                script{
                    try{
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("warning" ,"Building docker image stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")

                        if ("${params.ENVIRONMENT}" == "production")
                        {
                            dockerfile_path="${env.WORKSPACE_PATH_JENKINS_SERVER}/Dockerfile "
                            download_file_from_s3("${env.ENV}","${env.AWS_PROFILE}","${env.S3_FOLDER}")
                            check_env_variables("${env.AWS_PROFILE}")
                            build_docker_image(githash,dockerfile_path,docker_image_name,false,true)
                        } 
                        else 
                        {
                            dockerfile_path="${env.WORKSPACE_PATH_JENKINS_SERVER}/DockerfileDev"
                            build_docker_image(githash,dockerfile_path, docker_image_name,true)
                        }

                    } catch(Exception e) {
                        echo "FAILED ${e}"
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("danger","Failed Building docker image stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
                        currentBuild.result = 'FAILURE'
                        throw e

                    }
                }

            }
        }

        stage('Scan and Publish image') {
            steps {
                script {
                    try {
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("warning", "Analyzing Docker image stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'", "${env.SLACK_SEND_CHANNEL}")
                        scan_and_publish_docker_image(githash, docker_image_name)
                       
                        
                        sendSlackMessage("good", "Image scanning completed successfully for ${docker_image_name}:${githash}", "${env.SLACK_SEND_CHANNEL}")
                    } catch (Exception e) {
                        echo "FAILED: ${e}"
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("danger", "Image scanning failed for ${docker_image_name}:${githash}\n${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'", "${env.SLACK_SEND_CHANNEL}")
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Removing the Old Code') {
            steps {
                script {
                    try{
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("warning","Removing the Old Code stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")

                        removing_old_code()
                    } catch(Exception e) {
                        echo "FAILED ${e}"
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("danger","Failed Removing the Code stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }
        stage("Transferring the Code") {
            steps {
                script {

                    try{
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("warning","Transferring the Code stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
                        transfer_code_to_server()

                    } catch(Exception e) {
                        echo "FAILED ${e}"
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("danger","Failed Transferring the Code stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }

            }
        }

        stage("Restarting Application") {
            steps {
                script {
                    def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                    try{
                        sendSlackMessage("warning","Restarting the Application stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
                        if ("${params.ENVIRONMENT}" == "production") 
                        {
                            run_container_on_server(githash,docker_image_name)
                        } 
                        else {
                            run_container_on_server(githash,docker_image_name,true)
                        }
                        sendSlackMessage ("good","SUCCESSFUL-deployed at ${env.SITE_URL}","${env.SLACK_SEND_CHANNEL}")
                    
                    } catch(Exception e) {
                        echo "FAILED ${e}"
                        sendSlackMessage("danger","Failed Restarting Application stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
                        currentBuild.result = 'FAILURE'
                                              throw e
                    }
                }
            }
        }

        stage("Gitlab Cleanup") {
            steps {
                script {

                    try{
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("warning","Gitlab Cleanup stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
                        gitlab_cleanup("${GITLAB_BASE_URL}","${gitlab_auth_token}","${env.PIPELINE_NAME}","${params.ENVIRONMENT}")
                    
                    } catch(Exception e) {
                        echo "FAILED ${e}"
                        def cause = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')
                        sendSlackMessage("danger"," Failed Gitlab Cleanup stage started - ${env.PIPELINE_NAME} :: '${env.JOB_NAME} ${cause.userName} [${env.BUILD_NUMBER}]'","${env.SLACK_SEND_CHANNEL}")
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }
    }
}
