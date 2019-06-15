import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import route53 = require('@aws-cdk/aws-route53')
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager'
import cloudfront = require('@aws-cdk/aws-cloudfront')
import targets = require('@aws-cdk/aws-route53-targets/lib')

export class AwsFraserxuDevStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: 'aws.fraserxu.dev',
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html'
    })

    new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName })

    const hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'fraserxu.dev'
    })

    const certificateArn = new DnsValidatedCertificate(this, 'Certificate', {
      domainName: 'aws.fraserxu.dev',
      hostedZone
    }).certificateArn

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificateArn
    })

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket
            },
            behaviors: [{ isDefaultBehavior: true }]
          }
        ],
        aliasConfiguration: {
          acmCertRef: certificateArn,
          names: ['aws.fraserxu.dev'],
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLSv1_1_2016
        }
      }
    )

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId
    })

    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: 'aws.fraserxu.dev',
      target: route53.AddressRecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone: hostedZone
    })
  }
}
