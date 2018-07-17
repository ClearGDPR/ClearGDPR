#!/bin/bash

make -C cg build && make -C cg push
make -C admin dist && make -C admin build && make -C admin push
make -C api build && make -C api push
make -C frontend dist && make -C frontend build && make -C frontend push
make -C cg tag-latest
make -C admin tag-latest
make -C api tag-latest
make -C frontend tag-latest
VERSION=latest make -C cg push
VERSION=latest make -C admin push
VERSION=latest make -C api push
VERSION=latest make -C frontend push