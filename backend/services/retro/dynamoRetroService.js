const config = require('../../config');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: config.REGION });
const docClient = DynamoDBDocumentClient.from(client); // Suporte para JSON simplificado

const putTable = (tableName, item) => {
  return new Promise((resolve, reject) => {
    docClient
      .send(new PutCommand({ TableName: tableName, Item: item }))
      .then((data) => {
        console.log(`Item ${item._id} inserido com sucesso na tabela ${tableName}!`);
        resolve(data);
      })
      .catch((error) => {
        console.error(`Erro ao inserir na tabela ${tableName}:`, error);
        reject(`Erro ao inserir na tabela ${tableName}:`); 
      });
  });
};

module.exports = { putTable };