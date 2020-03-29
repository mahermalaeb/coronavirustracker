import { Stack, Construct, StackProps, CfnOutput } from "@aws-cdk/core";
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment
} from "@aws-cdk/aws-cognito";
import {
  GraphQLApi,
  FieldLogLevel,
  MappingTemplate,
  KeyCondition,
  CfnGraphQLApi
} from "@aws-cdk/aws-appsync";
import { join } from "path";
import { Table, BillingMode, AttributeType } from "@aws-cdk/aws-dynamodb";
import {
  Role,
  FederatedPrincipal,
  PolicyStatement,
  Effect
} from "@aws-cdk/aws-iam";

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * API
     */

    const api = new GraphQLApi(this, "api", {
      name: `api`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      },
      schemaDefinitionFile: join(__dirname, "./schema.graphql")
    });
    const cfnApi = api.node.defaultChild as CfnGraphQLApi;
    cfnApi.authenticationType = "AWS_IAM";

    /**
     * Identity pool
     */
    const identityPool = new CfnIdentityPool(this, "identityPool", {
      allowUnauthenticatedIdentities: true,
      identityPoolName: "identityPool"
    });

    const unauthenticatedIdentityPoolRole = new Role(
      this,
      "unauthenticatedIdentityPoolRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": identityPool.ref
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated"
            }
          },
          "sts:AssumeRoleWithWebIdentity"
        )
      }
    );

    new CfnIdentityPoolRoleAttachment(this, "identityPoolRoleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        unauthenticated: unauthenticatedIdentityPoolRole.roleArn
      }
    });

    unauthenticatedIdentityPoolRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["appsync:GraphQL"],
        resources: [api.arn]
      })
    );

    /**
     * Data
     */

    const contactTable = new Table(this, "contactTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "userId",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "id",
        type: AttributeType.STRING
      }
    });

    const infectionTable = new Table(this, "infectionTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      }
    });

    /**
     * Resolvers & data sources
     */

    // Contact
    const contactDataSource = api.addDynamoDbDataSource(
      "Contact",
      "The contact data source",
      contactTable
    );

    contactDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createContact",
      requestMappingTemplate: MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "userId": $util.dynamodb.toDynamoDBJson($ctx.args.userId),
          "id": $util.autoId()
        },
        "attributeValues" : {
          "contactUserId": $util.dynamodb.toDynamoDBJson($ctx.args.contactUserId),
          "contactTimestamp": $util.dynamodb.toDynamoDBJson($ctx.args.contactTimestamp),
          "createdTimestamp": $util.time.nowEpochSeconds(),
          "expiredTimestamp": $util.time.nowEpochSeconds() + (60 * 60 * 24 * 5) # 5 Days
        },
        "condition" : {
          "expression" : "#userId <> :userId AND #id <> :id",
          "expression" : "someExpression",
          "expressionNames" : {
              "#userId" : "userId",
              "#id" : "id"
          },
          "expressionValues" : {
              ":userId" :  {"S": userId},
              ":id" :  {"S": id}
          },
        }
      }`),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    });

    // Infection
    const infectionDataSource = api.addDynamoDbDataSource(
      "Infection",
      "The infection data source",
      infectionTable
    );

    infectionDataSource.createResolver({
      typeName: "Query",
      fieldName: "getInfection",
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem("id", "id"),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    });

    infectionDataSource.createResolver({
      typeName: "Query",
      fieldName: "getInfections",
      requestMappingTemplate: MappingTemplate.dynamoDbQuery(
        KeyCondition.eq("userId", "userId")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList()
    });

    // TODO - create and delete infection

    /**
     * Outputs
     */

    new CfnOutput(this, "identityPoolId", {
      value: identityPool.ref,
      exportName: "identityPoolId"
    });

    new CfnOutput(this, "apiUrl", {
      value: api.graphQlUrl,
      exportName: "apiUrl"
    });

    new CfnOutput(this, "stackRegion", {
      value: this.region,
      exportName: "stackRegion"
    });
  }
}
