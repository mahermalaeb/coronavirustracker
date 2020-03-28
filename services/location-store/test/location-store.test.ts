import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import LocationStore = require('../lib/location-store-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LocationStore.LocationStoreStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
