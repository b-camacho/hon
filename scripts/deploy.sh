#!/bin/bash

set -euox pipefail

REMOTE="do"
REMOTE_APP_DIR="~/hon"
REMOTE_STATIC_DIR="~/hon/static"

npm run build

ssh $REMOTE "mkdir -p $REMOTE_APP_DIR/server"

rsync -zaP dist/* $REMOTE:$REMOTE_STATIC_DIR/
rsync -zaP static/* $REMOTE:$REMOTE_STATIC_DIR/assets


rsync -zaP package.json $REMOTE:$REMOTE_APP_DIR/
rsync -zaP package-lock.json $REMOTE:$REMOTE_APP_DIR/
rsync -zaP src/server/* $REMOTE:$REMOTE_APP_DIR/server/

ssh $REMOTE "source ~/.zshrc && cd $REMOTE_APP_DIR && \
  cd $REMOTE_APP_DIR && \
  bun install --production && \
  pm2 delete hon 2>/dev/null || true && \
  pm2 start server/index.ts --name hon --interpreter bun 
"

echo "done" 