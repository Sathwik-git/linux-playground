import {
  EC2Client,
  RunInstancesCommand,
  DescribeInstancesCommand,
  TerminateInstancesCommand,
  RunInstancesCommandInput,
  waitUntilInstanceRunning,
} from "@aws-sdk/client-ec2";
import { fromEnv } from "@aws-sdk/credential-providers";

// Initialize EC2 client with environment variables
const ec2 = new EC2Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

interface EC2Instance {
  instanceId: string;
  publicIp: string;
}

/**
 * Launches a single EC2 instance and returns the instance ID and public IP.
 * @returns Promise resolving to instance details or undefined if launch fails
 */
export const launchInstance = async (): Promise<EC2Instance | undefined> => {
  try {
    // Validate environment variables
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('Missing required AWS configuration');
    }

    const input: RunInstancesCommandInput = {
      ImageId: "ami-0805c267d23329848",
      InstanceType: "t2.micro",
      MinCount: 1,
      MaxCount: 1,
      SecurityGroupIds: ["sg-0ad873d700e9899f6"]
    };

    // Launch the instance
    const command = new RunInstancesCommand(input);
    const response = await ec2.send(command);

    const instance = response.Instances?.[0];
    if (!instance?.InstanceId) {
      throw new Error('Failed to launch instance');
    }

    console.log("Launching EC2 Instance:", instance.InstanceId);
    console.log("Waiting for instance to be running...");

    // Wait for the instance to be running
    await waitUntilInstanceRunning(
      { client: ec2, maxWaitTime: 300 },
      { InstanceIds: [instance.InstanceId] }
    );

    // Get instance details after it's running
    const describeCommand = new DescribeInstancesCommand({
      InstanceIds: [instance.InstanceId],
    });

    const describeResponse = await ec2.send(describeCommand);
    const runningInstance = describeResponse.Reservations?.[0]?.Instances?.[0];

    if (!runningInstance?.PublicIpAddress) {
      throw new Error('Failed to get public IP address');
    }

    console.log("Instance is running!");
    console.log("Public IP:", runningInstance.PublicIpAddress);

    return {
      instanceId: instance.InstanceId,
      publicIp: runningInstance.PublicIpAddress,
    };
  } catch (error) {
    console.error("Error launching EC2 instance:", error instanceof Error ? error.message : 'Unknown error');
    return undefined;
  }
};

/**
 * Terminates an EC2 instance by its public IP.
 * @param publicIp The public IP of the EC2 instance to terminate
 * @throws Error if instance cannot be found or terminated
 */
export const terminateInstanceByIp = async (publicIp: string): Promise<void> => {
  try {
    if (!publicIp) {
      throw new Error('Public IP is required');
    }

    const describeCommand = new DescribeInstancesCommand({
      Filters: [
        {
          Name: "ip-address",
          Values: [publicIp],
        },
      ],
    });

    const describeResponse = await ec2.send(describeCommand);
    const reservations = describeResponse.Reservations;

    if (!reservations?.length || !reservations[0].Instances?.length) {
      throw new Error(`No instance found with IP: ${publicIp}`);
    }

    const instanceId = reservations[0].Instances[0].InstanceId;
    if (!instanceId) {
      throw new Error('Could not extract instance ID');
    }

    console.log("Terminating instance:", instanceId);

    const terminateCommand = new TerminateInstancesCommand({
      InstanceIds: [instanceId],
    });

    await ec2.send(terminateCommand);
    console.log("Instance terminated successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error during instance termination:", errorMessage);
    throw error;
  }
};

/**
 * Helper function to check if AWS credentials are configured
 * @returns boolean indicating if AWS is properly configured
 */
export const isAwsConfigured = async (): Promise<boolean> => {
  try {
    const credentials = await fromEnv()();
    return !!(
      credentials.accessKeyId &&
      credentials.secretAccessKey &&
      process.env.AWS_REGION
    );
  } catch (error) {
    console.error("AWS credentials validation failed:", error);
    return false;
  }
};