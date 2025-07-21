import type { Handler } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import type { Schema } from "../../data/resource"
export const handler: Schema["getInterview"]["functionHandler"] = async (event, context) => {
  const client = new DynamoDBClient({});
  const tableName = 'Interview-alyfnsvoxfawtn73h6t74odmkm-NONE'; // Replace with your actual table name

  const id = event.arguments.id;
  const getParams = {
    TableName: tableName,
    Key: {
      id: { S: id }
    },
    ProjectionExpression: 'interviewee_name, interviewee_organization, journalist_name'
  };

  const { Item } = await client.send(new GetItemCommand(getParams));

  if (!Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Interview not found' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      interviewee_name: Item.interviewee_name?.S || '',
      interviewee_organization: Item.interviewee_organization?.S || '',
      journalist_name: Item.journalist_name?.S || ''
    })
  };
};