import type { AWS } from '@serverless/typescript'

const serverlessConfiguration: AWS = {
  service: 'sls-notes-api',
  frameworkVersion: '3',
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    region: 'eu-west-2',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      NOTES_TABLE: 'notes-table-${opt:stage, "dev"}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:*',
            Resource:
              'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.NOTES_TABLE}',
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    createNote: {
      handler: 'src/handlers/create.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'note',
          },
        },
      ],
    },
    getNote: {
      handler: 'src/handlers/get.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'note',
          },
        },
      ],
    },
    deleteNote: {
      handler: 'src/handlers/delete.handler',
      events: [
        {
          http: {
            method: 'delete',
            path: 'note/{id}',
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: 'webpack.config.js',
      includeModules: true,
      packager: 'yarn',
      excludeFiles: 'src/**/*.test.ts',
      forceExclude: ['aws-sdk'],
    },
  },
  resources: {
    Resources: {
      NotesTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: '${self:provider.environment.NOTES_TABLE}',
          AttributeDefinitions: [
            {
              AttributeName: 'user_id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'timestamp',
              AttributeType: 'N',
            },
            {
              AttributeName: 'note_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'user_id',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'timestamp',
              KeyType: 'RANGE',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'note_id-index',
              KeySchema: [
                {
                  AttributeName: 'note_id',
                  KeyType: 'HASH',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
