## aws.fraserxu.me

A demo site shows how to build a static site hosted on AWS with aws-cdk.

### How it works?

This website use `aws-cdk`, a tool from `AWS`, to generate a `Cloudformation` stack template in `TypeScript`.

- A S3 bucket to hosts static assets
- Create a HostedZone on route53
- Create a Certificate using DNS based validation
- Create a Cloudfront distribution using the S3 bucket and Certificate
- Create a DNS record from the Cloudfront distribution to the custom domain

An attempt to build a static site using differnt stacks or tools.
