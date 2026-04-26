import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Frontend: S3 Bucket for static assets
    const frontendBucket = new s3.Bucket(this, 'DocodoFrontendBucket', {
      websiteIndexDocument: 'index.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. CloudFront: CDN for Frontend
    const distribution = new cloudfront.Distribution(this, 'DocodoDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // 3. Backend: Lambda Function (Node.js)
    const backendLambda = new nodejs.NodejsFunction(this, 'DocodoBackendLambda', {
      entry: path.join(__dirname, '../../backend/src/server.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production',
        FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '',
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // 4. API Gateway: Expose Backend Lambda
    const api = new apigateway.LambdaRestApi(this, 'DocodoApi', {
      handler: backendLambda,
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'FrontendURL', {
      value: distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, 'BackendURL', {
      value: api.url,
    });
  }
}
