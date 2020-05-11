import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';

export interface ClusterStackProps extends cdk.StackProps {
    maxAZs: number;
    natGateways: number;
}

export class ClusterStack extends cdk.Stack {
    public readonly vpc: ec2.Vpc;
    public readonly cluster: ecs.Cluster;

    constructor(scope: cdk.Construct, id: string, props: ClusterStackProps) {
        super(scope, id, props);

        this.vpc = new ec2.Vpc(this, 'Vpc', { 
            maxAzs: props.maxAZs,
            natGateways: props.natGateways,
        })

        this.cluster = new ecs.Cluster(this, 'FargateCluster', {
            vpc: this.vpc
        })
    }
}
