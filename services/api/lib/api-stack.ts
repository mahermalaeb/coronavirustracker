import * as cdk from '@aws-cdk/core';
import { UserPool } from '@aws-cdk/aws-cognito';
import { GraphQLApi, UserPoolDefaultAction, FieldLogLevel } from '@aws-cdk/aws-appsync';

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // User Pool
    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: "users"
    });

    // API
    const api = new GraphQLApi(this, 'Api', {
      name: `demoapi`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          userPool,
          defaultAction: UserPoolDefaultAction.ALLOW,
        },

      },
      schemaDefinitionFile: './schema.graphql',
    });


  }
}
