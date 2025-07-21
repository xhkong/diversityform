import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

export const handler: Handler = async (event, context) => {
  const client = new DynamoDBClient({});
  const tableName = 'DMNInterviewFeedbacks'; // Replace with your actual table name

  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  // Define the expected data format for the interview feedback form
  // Match the fields from the InterviewFeedback form
  const item = {
    interviewId: { S: body.interviewId || '' },
    interviewee_name: { S: body.interviewee_name || '' },
    interviewee_organization: { S: body.interviewee_organization || '' },
    journalist_name: { S: body.journalist_name || '' },
    experience: { S: body.experience || '' },
    suggestions: { S: body.suggestions || '' },
    rating: { N: body.rating ? String(body.rating) : '0' },
    donationAmt: { N: body.donationAmt ? String(body.donationAmt) : '0' },
    submittedAt: { S: new Date().toISOString() }
  };

  await client.send(new PutItemCommand({
    TableName: tableName,
    Item: item,
    ConditionExpression: 'attribute_not_exists(interviewId)'
  })).catch(async (error) => {
    // If item exists, update it
    if (error.name === 'ConditionalCheckFailedException') {
      const { UpdateItemCommand } = await import('@aws-sdk/client-dynamodb');
      await client.send(new UpdateItemCommand({
        TableName: tableName,
        Key: { interviewId: item.interviewId },
        UpdateExpression: 'SET interviewee_name = :name, interviewee_organization = :org, journalist_name = :jname, experience = :exp, suggestions = :sugg, rating = :rating, donationAmt = :donation, submittedAt = :submittedAt',
        ExpressionAttributeValues: {
          ':name': item.interviewee_name,
          ':org': item.interviewee_organization,
          ':jname': item.journalist_name,
          ':exp': item.experience,
          ':sugg': item.suggestions,
          ':rating': item.rating,
          ':donation': item.donationAmt,
          ':submittedAt': item.submittedAt
        }
      }));
    } else {
      throw error;
    }
  });
  return true;
};