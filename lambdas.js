function cc_login():
  var AWS = require('aws-sdk');
  var dynamoDb = new AWS.DynamoDB.DocumentClient();
  /*
  var friendList = event['friendlist'].split("/")
  var facebookid = event['fbid']
  var username = event['fbusername']
  */
  var friendList = event['queryStringParameters']['friendlist'].split("/")
  var facebookid = event['queryStringParameters']['fbid']
  var username = event['queryStringParameters']['fbusername']

  console.log("after reading everything")
  AWS.config.update({
  accessKeyId: "...",
  secretAccessKey: "...",
  region:"us-east-1"
  });
  console.log("after creating docclient")
  var params = {
    TableName: "user",
    KeyConditionExpression: "#fb = :yyyy",
    ExpressionAttributeNames:{
        "#fb": "facebookId"
    },
    ExpressionAttributeValues: {
        ":yyyy": facebookid
    }
  }

  return dynamoDb.query(params)
  .promise()
  .then(response => {
    console.log(response)
    console.log(response.count)
    if (response.Count == 0) {
        console.log("count is 0")
        params = {
            TableName: "user",
            Item:{
                "username": username,
                "facebookId": facebookid,
                "giftList":[],
                "friendsList": friendList
            }
        }
        return dynamoDb.put(params)
        .promise()
        .then(response=> {
            var response = {
                statusCode: 200,
                body: JSON.stringify({err:"false", mongooseId:facebookid})
            };
            return response;
        })
        .catch(err => {
            console.log(err);
        })
    } else {
        const response = {
                statusCode: 200,
                body: JSON.stringify({err:"false", mongooseId:facebookid})
            };
        return response;
    }
  })

function get_wishes():
