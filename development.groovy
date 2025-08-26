env.SLACK_SEND_PROJECT_NAME = "document-microservice"
env.SLACK_SEND_CHANNEL = "jenkins"
env.MAIN_DOMAIN = "webelight.co.in"
env.WORKSPACE_PATH_JENKINS_SERVER = "/var/lib/jenkins/workspace/Microservices/document-microservice"
env.BUILD_NUMBER = "$BUILD_NUMBER"

/* Gitlab and docker variables */ 

env.GITLAB_REGISTRY = "registry.gitlab.webelight.co.in"
env.GITREPO_PATH = "webelight/microservices/document-microservice"
env.DOCKER_PORT = "4007"
env.ENVIRONMENT = "dev"

/* server information */
env.REPOSITORY_NAME = "document-microservice"
env.SERVER_USERNAME = "devops"
env.SERVER_IP = "109.169.37.51"
env.SERVER_PATH = "/var/www/chat-api.webelight.co.in" 
env.ENV = ".env"
env.SITE_URL = "https://chat-api.webelight.co.in/"

/* sonarqube variables */

env.PROJECTKEY = "chat-api-microservice"
env.SONARQUBE_HOST = "https://sonarqube.${env.MAIN_DOMAIN}"
env.SONARQUBE_TOKEN = "sqp_9a9375ec556b3f7cd2e5480967107c1acdd72a4a"

/* infisical variable */

env.INFISICAL_TOKEN = "st.64d33ff36ddd8f1088e09ae4.6972ff5694816d4b281b62d704726a40.1b166e69e47ec252a2b74f9b2f5884b2"
env.INFISICAL_API_URL = "https://infisical.webelight.co.in/api"
env.INFISICAL_ENV = "development"

/* sentry variables (Sentry is not used here for now) */

env.REACT_APP_NODE_ENV = "development"

