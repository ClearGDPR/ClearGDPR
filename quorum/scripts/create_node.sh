#!/bin/bash

set -e

uid=`id -u`
gid=`id -g`
pwd=`pwd`

if [ "$1" = "" ] || [ "$2" = "" ] || [ "$3" = "" ] || [ "$4" = "" ] || [ "$5" = "" ] || [ "$6" = "" ] || [ "$7" = "" ] || [ "$8" = "" ] ; then
    echo "Usage of the command:"
    echo "    quorum/scripts/create_node.sh target_directory constellation_ip geth_ip constellation_port eth_port raft_port rpc_port websocket_port [password]"
    echo "    target_directory: subdir under quorum/generated_configs/"
    echo ""
    echo "Example:"
    echo "    quorum/scripts/create_node.sh node2 127.0.0.1 127.0.0.1 9000 30303 50400 8545 8546 p@sw0rd1"
    exit 1
fi

target_dir=$pwd'/quorum/generated_configs'/$1
constellation_ip=$2
geth_ip=$3
constellation_port=$4
eth_port=$5
raft_port=$6
rpc_port=$7
ws_port=$8
password=$9

image=cleargdpr/quorum

if [ -d $target_dir ]; then
    rm -rf $target_dir
fi

mkdir -p $target_dir

touch $target_dir/.env.start
echo "NODE_IP=$constellation_ip" > $target_dir/.env.start
echo "NODE_PORT=$constellation_port" >> $target_dir/.env.start
echo "" >> $target_dir/.env.start
echo "RPC_PORT=$rpc_port" >> $target_dir/.env.start
echo "ETH_PORT=$eth_port" >> $target_dir/.env.start
echo "RAFT_PORT=$raft_port" >> $target_dir/.env.start
echo "WEBSOCKET_PORT=$ws_port" >> $target_dir/.env.start
echo "ACCOUNT_PASSWORD=$password" >> $target_dir/.env.start


echo "https://$constellation_ip:$constellation_port/" >> $target_dir/node.url

enode=`docker run -u $uid:$gid -v $target_dir:/qdata $image sh -c "/usr/local/bin/bootnode -genkey /qdata/nodekey -writeaddress; cat /qdata/nodekey"`
enode=`docker run -u $uid:$gid -v $target_dir:/qdata $image sh -c "/usr/local/bin/bootnode -nodekeyhex $enode -writeaddress"`
echo "enode://$enode@$geth_ip:$eth_port?discport=0&raftport=$raft_port" > $target_dir/static_nodes_entry

if [ ! -d $target_dir/keys ]; then
    mkdir -p $target_dir/keys
fi

docker run -u $uid:$gid -v $target_dir:/qdata $image /usr/local/bin/constellation-node --generatekeys=/qdata/keys/tm < /dev/null > /dev/null

if [ ! -d $target_dir/dd ]; then
    mkdir -p $target_dir/dd
fi

touch $target_dir/passwords.txt
echo $password > $target_dir/passwords.txt
account=`docker run -u $uid:$gid -v $target_dir:/qdata $image /usr/local/bin/geth --datadir=/qdata/dd --password /qdata/passwords.txt account new | cut -c 11-50`
echo $account > $target_dir/dd/account.txt
echo "All files generated in $target_dir"