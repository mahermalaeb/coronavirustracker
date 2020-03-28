#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LocationStoreStack } from '../lib/location-store-stack';

const app = new cdk.App();
new LocationStoreStack(app, 'LocationStoreStack');
