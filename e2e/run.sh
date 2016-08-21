#!/bin/bash

if [[ "$(basename `pwd`)" == "e2e" ]]; then
  echo "Run from the root of the project instead"
  echo "./e2e/run.sh"
  exit 1
fi

python -m SimpleHTTPServer 8888 &
http_pid=$!

function finish {
  kill -9 $http_pid
}
trap finish EXIT

protractor e2e/protractor.conf.js
