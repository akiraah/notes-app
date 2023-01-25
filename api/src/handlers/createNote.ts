import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

const client = new AWS.DynamoDB.DocumentClient()

interface Note {
  user_id: string
  note_id: string
  timestamp: number
  note: string
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(`createNote lambda invoked with: ${JSON.stringify(event)}`)
  const { user, note } = JSON.parse(event.body)
  const item: Note = {
    user_id: user,
    timestamp: new Date().getTime(),
    note_id: uuidv4(),
    note,
  }
  console.log(`item: ${JSON.stringify(item)}`)
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
        note: JSON.stringify(item),
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
