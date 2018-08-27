# based on https://github.com/ConsenSys/quorum-docker-Nnodes/blob/master/Dockerfile
FROM ubuntu:16.04 as builder

WORKDIR /work

RUN apt-get update && \
    apt-get install -y \
            build-essential \
            git \
            libdb-dev \
            libleveldb-dev \
            libsodium-dev \
            zlib1g-dev \
            libtinfo-dev \
            sysvbanner \
            wget \
            wrk \
            xz-utils

RUN wget -q https://github.com/jpmorganchase/constellation/releases/download/v0.3.2/constellation-0.3.2-ubuntu1604.tar.xz && \
    tar xvf constellation-0.3.2-ubuntu1604.tar.xz && \
    mv constellation-0.3.2-ubuntu1604 ubuntu1604 && \
    cp ubuntu1604/constellation-node /usr/local/bin && \
    chmod 0755 /usr/local/bin/constellation-node && \
    rm -rf constellation-0.3.2-ubuntu1604.tar.xz ubuntu1604

ENV GOREL go1.10.1.linux-amd64.tar.gz
ENV PATH $PATH:/usr/local/go/bin

RUN wget -q https://storage.googleapis.com/golang/$GOREL && \
    tar xfz $GOREL && \
    mv go /usr/local/go && \
    rm -f $GOREL

RUN git clone https://github.com/jpmorganchase/quorum.git && \
    cd quorum && \
    git checkout tags/v2.0.2 && \
    make all && \
    cp build/bin/geth /usr/local/bin && \
    cp build/bin/bootnode /usr/local/bin && \
    cd .. && \
    rm -rf quorum

### Create the runtime image, leaving most of the cruft behind (hopefully...)

FROM ubuntu:16.04

# Install add-apt-repository
RUN apt-get update && \
    apt-get install -y --no-install-recommends software-properties-common && \
    add-apt-repository ppa:ethereum/ethereum && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        libdb-dev \
        libleveldb-dev \
        libsodium-dev \
        zlib1g-dev \
        libtinfo-dev \
        netbase \
        ca-certificates \
        curl \
        solc && \
    rm -rf /var/lib/apt/lists/*

# Temporary useful tools
# RUN apt-get update && \
#        apt-get install -y iputils-ping net-tools vim

RUN mkdir -p /templates && mkdir -p /scripts
COPY --from=builder \
        /usr/local/bin/constellation-node \
        /usr/local/bin/geth \
        /usr/local/bin/bootnode \
        /usr/local/bin/


COPY ./templates/tm.conf /templates/tm.conf
COPY ./start_node_processor.sh /scripts/start_node_processor.sh
RUN chmod +x /scripts/start_node_processor.sh

CMD ["/scripts/start_node_processor.sh"]