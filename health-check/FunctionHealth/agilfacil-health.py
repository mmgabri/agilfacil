import os
import json
import boto3
import requests
import logging

# Configurando o logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Níveis: DEBUG, INFO, WARNING, ERROR, CRITICAL

def lambda_handler(event, context):
    sns_topic_arn = os.getenv("SNS_TOPIC_ARN")
    url_api_health = os.getenv("URL_API_HEALTH")

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

            # Envia uma mensagem SNS em caso de falha
            sns = boto3.client('sns')
            sns.publish(
                TopicArn=sns_topic_arn ,
                Message='Service is DOWN on instance!',
                Subject='EC2 agilfacil Health Check Alert'
            )
            return {
                'statusCode': 500,
                'body': json.dumps('Service is DOWN')
            }

    except Exception as e:
        logger.exception(f"Ocorreu um erro: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }