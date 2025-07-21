import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

export const handler: Handler = async (event, context) => {
  const client = new DynamoDBClient({});
  const tableName = 'DMNInterviewFeedbacks'; // Replace with your actual table name

  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  const item = {
    id: { S: context.awsRequestId },
    name: { S: body.name || '' },
    email: { S: body.email || '' },
    feedback: { S: body.feedback || '' },
    submittedAt: { S: new Date().toISOString() }
  };

  await client.send(new PutItemCommand({
    TableName: tableName,
    Item: item
  }));
  return true;
};