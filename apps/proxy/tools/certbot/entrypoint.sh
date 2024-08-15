#!/usr/bin/env bash

set -euo pipefail

# s3fs ################################
cleanup() {
  echo "Unmounting s3fs..."
  fusermount -u $S3FS_MOUNT
  exit 0
}

forward_signal() {
  kill -$1 "$MAIN_PID"
}

trap 'forward_signal SIGINT' SIGINT
trap 'forward_signal SIGTERM' SIGTERM
trap 'cleanup' EXIT

# Create the mount point directory
mkdir -p $S3FS_MOUNT

# Mount the S3 bucket
s3fs $BUCKET_NAME $S3FS_MOUNT -o use_path_request_style -o url=$AWS_ENDPOINT_URL_S3 -o endpoint=$AWS_REGION

# Check if the mount was successful
if mountpoint -q $S3FS_MOUNT; then
  echo "S3 bucket mounted successfully at $S3FS_MOUNT"
else
  echo "Failed to mount S3 bucket"
  exit 1
fi

# cloudflare.ini ######################
echo "dns_cloudflare_api_token = $CLOUDFLARE_API_TOKEN" > /app/cloudflare.ini
chmod 600 /app/cloudflare.ini

# Execute the original command
"$@" &
MAIN_PID=$!

wait $MAIN_PID
