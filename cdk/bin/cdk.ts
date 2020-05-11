#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import { ClusterStack } from '../lib/cluster-stack';
import { AppStack } from '../lib/app-stack';
import { DevPipelineStack } from '../lib/dev-pipeline-stack';
import { StagingProdPipelineStack } from '../lib/staging-prod-pipeline-stack';

const app = new cdk.App();

// Cluster Stacks - maxAZs of 3 is best practice, but make sure you have no EIP limitations (5 is default)
const devClusterStack = new ClusterStack(app, 'DevCluster', {
    maxAZs: 2,
    natGateways: 1,
});
cdk.Tag.add(devClusterStack, 'environment', 'dev');

const prodClusterStack = new ClusterStack(app, 'ProdCluster', {
    maxAZs: 2,
    natGateways:1,
});
cdk.Tag.add(prodClusterStack, 'environment', 'prod');


// CodePipeline stacks
const devPipelineStack = new DevPipelineStack(app, 'DevPipelineStack');
cdk.Tag.add(devPipelineStack, 'environment', 'dev');


const stagingProdPipelineStack = new StagingProdPipelineStack(app, 'StagingProdPipelineStack', {
    appRepository: devPipelineStack.appRepository,
    imageTag: devPipelineStack.imageTag
});
cdk.Tag.add(stagingProdPipelineStack, 'environment', 'prod');

// DevAppStack
const devAppStack = new AppStack(app, 'DevAppStack', {
    vpc: devClusterStack.vpc,
    cluster: devClusterStack.cluster,
    //autoDeploy: false,
    appImage: devPipelineStack.appBuiltImage,
});
cdk.Tag.add(devAppStack, 'environment', 'dev');


// StagingAppStack
const stagingAppStack = new AppStack(app, 'StagingAppStack', {
    vpc: prodClusterStack.vpc,
    cluster: prodClusterStack.cluster,
    //autoDeploy: false,
    appImage: stagingProdPipelineStack.appBuiltImageStaging,
});
cdk.Tag.add(stagingAppStack, 'environment', 'staging');

// ProdAppStack
const prodAppStack = new AppStack(app, 'ProdAppStack', {
    vpc: prodClusterStack.vpc,
    cluster: prodClusterStack.cluster,
    //autoDeploy: false,
    appImage: stagingProdPipelineStack.appBuiltImageProd,
});
cdk.Tag.add(prodAppStack, 'environment', 'prod');

