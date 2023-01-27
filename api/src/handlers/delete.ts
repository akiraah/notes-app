import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'

AWS.config.apiVersions = {
  dynamodb: '2012-08-10',
}

const client = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' })

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(
    `getNote handler invoked: ${JSON.stringify(event.pathParameters)}`
  )
  const { id } = event.pathParameters
  console.log(`id; ${id}`)
  try {
    if (id) {
      const params = {
        Key: {
          user_id: id,
          timestamp: 1674655406294,
        },
        TableName: 'notes-table-dev',
        ConditionExpression: 'user_id = :user_id',
        ExpressionAttributeValues: {
          ':user_id': id,
        },
      }
      await client.delete(params).promise()

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'notes deleted',
        }),
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
