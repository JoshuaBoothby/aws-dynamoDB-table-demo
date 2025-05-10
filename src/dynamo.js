import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// Configure DynamoDBClient with region & credentials from environment variables
const client = new DynamoDBClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

// Wrap with DynamoDBDocumentClient
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Scan all items in the "Todo" table
export async function scanTodos() {
  const command = new ScanCommand({ TableName: "Todo" });
  const result = await ddbDocClient.send(command);
  return result.Items;
}

// Create a new item in the "Todo" table
export async function createTodo(item) {
  const command = new PutCommand({
    TableName: "Todo",
    Item: item,
  });
  await ddbDocClient.send(command);
  return item;
}

// Update fields on a single item
export async function updateTodo(id, updates) {
  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  for (const [key, value] of Object.entries(updates)) {
    updateExpression.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = value;
  }

  const command = new UpdateCommand({
    TableName: "Todo",
    Key: { id },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  const result = await ddbDocClient.send(command);
  return result.Attributes;
}

// Delete an item from the "Todo" table
export async function deleteTodo(id) {
  const command = new DeleteCommand({
    TableName: "Todo",
    Key: { id },
  });

  await ddbDocClient.send(command);
}
