import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as lambda from "@aws-cdk/aws-lambda";

export class Ex1DefineUserpoolStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Lambda Function
    const authEmailFn = new lambda.Function(this, "authEmailFn", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    // Cognito - UserPool
    const userPool = new cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: true, // Allow users to sign up
      autoVerify: { email: true }, // Verify email addresses by sending a verification code
      signInAliases: { email: true }, // Set email as an alias
      userVerification: {
        emailSubject: "Verify your email for our awesome app!",
        emailBody:
          "Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}",
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage:
          "Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}",
      },
      lambdaTriggers: {
        preSignUp: authEmailFn, ///Trigger before the signup process to userpool
      },
    });
  }
}
