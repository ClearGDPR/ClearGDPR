#!/bin/bash

set -e

uid=`id -u`
gid=`id -g`
pwd=`pwd`

cg_image=clear-gdpr_cg
quorum_image=clear-gdpr_quorum

cg_dir=$pwd/cg
qdata_dir=$pwd/$5

docker run -u $uid:$gid -v $cg_dir:/output -v $qdata_dir:/qdata $quorum_image /bin/sh -c "cat /qdata/dd/keystore/* > /output/quorum-pk.temp.json"
WALLET_PRIVATE_KEY=$(docker run -u $uid:$gid -v $cg_dir:/opt/app -v /opt/app/node_modules $cg_image sh -c "node scripts/get-wallet-pk.js quorum-pk.temp.json $3")
docker run -u $uid:$gid -v $cg_dir:/opt/app -v /opt/app/node_modules $cg_image sh -c "node scripts/generate-config.js $1 $2 $3 $4 $WALLET_PRIVATE_KEY"
rm $cg_dir/quorum-pk.temp.json