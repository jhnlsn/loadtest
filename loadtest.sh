#!/bin/bash

BASEDIR=$(dirname $0)
cur_dirname=${BASEDIR}

if [ $BASEDIR == "." ]; then
  cur_dirname="`pwd`"
fi

export NODE_PATH=$cur_dirname/lib

# Set the node environment
export NODE_ENV="dev"

export NODE_CONFIG_DIR=${cur_dirname}/config

node ${NODE_PATH}/loadtest.js $@