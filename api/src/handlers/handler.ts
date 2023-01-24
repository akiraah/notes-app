import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'

const client = new AWS.DynamoDB.DocumentClient()

interface Note {
  user_id: string
  timestamp: number
}

export const createNote = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(`createNote lambda invoked with: ${JSON.stringify(event)}`)

  const item: Note = {
    user_id: 'test',
    timestamp: new Date().getTime(),
  }

  const params = {
    TableName: 'notes-table-dev',
    Item: item,
  }

  try {
    await client.put(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'note created successfully',
      }),
    }
  } catch (error) {
    console.log(`Error ${error.message}`)
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'failed to create note',
      }),
    }
  }
}
