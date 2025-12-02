# deploy-windows.ps1
# 1) Prereqs: AWS CLI v2, Docker Desktop (Windows), Node & npm installed

# Configure AWS CLI (interactive)
aws configure
# enter AWS Access Key ID, Secret, default region (e.g. ap-south-1), default output json

$REGION = "ap-south-1"        # change as needed
$ACCOUNT_ID = "ACCOUNT_ID"    # your AWS account id
$ENVNAME = "quickgpt"
$VPC_ID = "vpc-xxxxxx"        # replace
$SUBNET_IDS = "subnet-aaa,subnet-bbb"  # replace, comma separated
$STACK_ECS = "${ENVNAME}-ecs-stack"
$STACK_S3 = "${ENVNAME}-frontend-stack"
$FRONTEND_DIR = "C:\path\to\quickgpt-frontend\build" # after npm run build
$BACKEND_DIR = "C:\path\to\quickgpt-backend"
$AWS_REGION = $REGION

# 2) Build backend Docker image locally
cd $BACKEND_DIR
docker --version
# build
docker build -t ${ENVNAME}-backend:latest -f Dockerfile.backend .

# 3) Create ECR repository (CloudFormation will create it, but we can make sure)
aws ecr create-repository --repository-name ${ENVNAME}-backend-repo --region $AWS_REGION || Write-Host "repo might already exist"

# 4) Authenticate Docker to ECR (PowerShell)
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# 5) Tag and push
docker tag ${ENVNAME}-backend:latest "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ENVNAME}-backend-repo:latest"
docker push "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ENVNAME}-backend-repo:latest"

# 6) Deploy CloudFormation ECS stack (creates ECS cluster, ALB, DocumentDB, etc.)
# Make sure you supply existing VpcId and SubnetIds
aws cloudformation deploy `
  --template-file .\deployment\aws\ecs-cluster-cloudformation.yaml `
  --stack-name $STACK_ECS `
  --region $AWS_REGION `
  --capabilities CAPABILITY_NAMED_IAM `
  --parameter-overrides EnvironmentName=$ENVNAME VpcId=$VPC_ID SubnetIds=$SUBNET_IDS

# Wait (CloudFormation will run) - monitor in console or use describe-stacks

# 7) Get ALB DNS (output)
aws cloudformation describe-stacks --stack-name $STACK_ECS --region $AWS_REGION --query "Stacks[0].Outputs"

# 8) Frontend: build (on your machine)
cd "C:\path\to\quickgpt-frontend"
npm install
npm run build   # creates build/ folder

# 9) Create S3 bucket & CloudFront using CloudFormation
aws cloudformation deploy `
  --template-file .\deployment\aws\s3-cloudfront-cloudformation.yaml `
  --stack-name $STACK_S3 `
  --region $AWS_REGION `
  --capabilities CAPABILITY_NAMED_IAM `
  --parameter-overrides EnvironmentName=$ENVNAME

# 10) Upload frontend build to S3 (get bucket name from CFN outputs)
$bucketName = (aws cloudformation describe-stacks --stack-name $STACK_S3 --region $AWS_REGION --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" --output text)
aws s3 sync .\build "s3://$bucketName" --region $AWS_REGION --delete

# 11) Create CloudFront invalidation
$distDomain = (aws cloudformation describe-stacks --stack-name $STACK_S3 --region $AWS_REGION --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomain'].OutputValue" --output text)
# find dist id (use list-distributions and match domain)
$distros = aws cloudfront list-distributions --region $AWS_REGION | ConvertFrom-Json
$dist = $distros.DistributionList.Items | Where-Object { $_.DomainName -eq $distDomain }
$distId = $dist.Id
aws cloudfront create-invalidation --distribution-id $distId --paths "/*"

Write-Host "Deployment commands finished. Monitor CloudFormation stack events in AWS Console."
