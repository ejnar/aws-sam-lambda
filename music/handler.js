const AWS = require("aws-sdk");

// const table = "dynamodb-music-table";
const table = process.env.TABLE_NAME;
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.music = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
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