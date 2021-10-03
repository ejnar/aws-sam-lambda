const AWS = require("aws-sdk");

const table = "dynamodb-music-table";
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.music = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      case "DELETE /music/{id}":
        await dynamo
          .delete({ TableName: table,
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /music/{id}":
        body = await dynamo
          .get({ TableName: table,
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;
      case "GET /music":
        body = await dynamo.scan({ TableName: table }).promise();
        break;
      case "POST /music":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({ TableName: table,
            Item: requestJSON
          })
          .promise();
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};