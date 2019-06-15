#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { AwsFraserxuDevStack } from '../lib/aws.fraserxu.dev-stack';

const app = new cdk.App();
new AwsFraserxuDevStack(app, 'AwsFraserxuDevStack');
