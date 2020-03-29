import * as cdk from "@aws-cdk/core";
import { UserPool } from "@aws-cdk/aws-cognito";
import {
  GraphQLApi,
  UserPoolDefaultAction,
  FieldLogLevel,
  MappingTemplate,
  KeyCondition,
  PrimaryKey
} from "@aws-cdk/aws-appsync";
import { join } from "path";
import { Table, BillingMode, AttributeType } from "@aws-cdk/aws-dynamodb";

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // User Pool
    const userPool = new UserPool(this, "userPool", {
      userPoolName: "users"
    });

    // API
    const api = new GraphQLApi(this, "api", {
      name: `api`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      },
      authorizationConfig: {
        defaultAuthorization: {
          userPool,
          defaultAction: UserPoolDefaultAction.ALLOW
        }
      },
      schemaDefinitionFile: join(__dirname, "./schema.graphql")
    });

    // Dynamodb
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
      responseMappingTemplate: MappingTemplate.dynamoDbResultList()
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
  }
}
