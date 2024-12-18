const config = require('../../config');
const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: config.REGION });
const docClient = DynamoDBDocumentClient.from(client);

const putTable = (tableName, item) => {
  return new Promise((resolve, reject) => {
    docClient
      .send(new PutCommand({ TableName: tableName, Item: item }))
      .then((data) => {
        console.log(`Item ${item._id} inserido com sucesso na tabela ${tableName}!`);
     //   const formattedItem = unmarshall(data);
        resolve(item);
      })
      .catch((error) => {
        console.error(`Erro ao inserir na tabela ${tableName}:`, error);
        reject(`Erro ao inserir na tabela ${tableName}:`);
      });
  });
};

const getBoardByUserDb = (tableName, indexNameUser, userId) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      IndexName: indexNameUser,
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
      },
    };

    docClient.send(new QueryCommand(params))
      .then((data) => {
        if (data.Items) {
          const formattedItems = data.Items.map((item) => unmarshall(item));
          resolve(formattedItems);
        } else {
          reject('Nenhum item encontrado no GSI.');
        }
      })
      .catch((error) => {
        reject(`Erro ao consultar o GSI: ${error.message}`);
      });
  });
}

const getBoardDb = (tableName, boardId) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      KeyConditionExpression: 'board_id = :boardId',
      ExpressionAttributeValues: {
        ':boardId': { S: boardId },
      },
    };

    docClient.send(new QueryCommand(params))
      .then((data) => {
        if (data.Items && data.Items.length > 0) {
          const formattedItem = unmarshall(data.Items[0]);
          resolve(formattedItem);
        } else {
          reject('NOT_FOUND');
        }
      })
      .catch((err) => {
        console.error('Erro ao consultar dados da tabela board:', err);
        reject('Erro ao consultar dados da tabela boad');
      });
  });
};

module.exports = { putTable, getBoardByUserDb, getBoardDb }