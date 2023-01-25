import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { QueryInput } from '@aws-sdk/client-dynamodb'

AWS.config.apiVersions = {
  dynamodb: '2012-08-10',
}

const client = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' })

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(
    `getNote handler invoked: ${JSON.stringify(event.queryStringParameters)}`
  )
  const { name } = event.queryStringParameters as { name: string }
  console.log(`name; ${name}`)
  try {
    if (name) {
      const params = {
        TableName: 'notes-table-dev',
        KeyConditionExpression: 'user_id = :user_id',
        ExpressionAttributeValues: {
          ':user_id': name,
        },
      }
      const { Items } = await client.query(params).promise()
      const response = Items.length ? Items : []
      console.log(`response; ${JSON.stringify(response)}`)
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      }
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: e.message,
      }),
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'retrieved a note',
    }),
  }
}
