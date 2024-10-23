import os
import json
import boto3
import requests
import logging

# Configurando o logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Níveis: DEBUG, INFO, WARNING, ERROR, CRITICAL

# Configurando variáveis de ambiente
sns_topic_arn = os.getenv("SNS_TOPIC_ARN")
url_api_health = os.getenv("URL_API_HEALTH")

# Configurando subject e message
subject='Alert - EC2 agilfacil Health Check'
message_api_down='Health Check com status_code diferente de 200.'
message_exception='Health Check com Exception.'

def lambda_handler(event, context):
    try:
        # Faz a requisição HTTP
        response = requests.get(url_api_health)

        if response.status_code == 200:
            logger.info("Service is healthy!")
            return {
                'statusCode': 200,
                'body': json.dumps('Service is healthy')
            }
        else:
            logger.error(f"Serviço fora do ar. Status HTTP: {response.status_code}")
            sendAlert(subject,message_api_down)
            return {
                'statusCode': 500,
                'body': json.dumps('Service is DOWN')
            }

    except Exception as e:
        logger.exception(f"Ocorreu um erro ao chamar api health check : {str(e)}")
        sendAlert(subject,message_exception)
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }

def sendAlert (subject,message):    
    sns = boto3.client('sns')
    sns.publish(
    TopicArn=sns_topic_arn ,
    Message=message,
    Subject=subject
            )
    logger.info("Alerta enviado via tópico sns!")