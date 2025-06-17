#!/bin/bash

##

reset

clear

##

set -e

set -x

##

cd .templater

bash templater.bash

cd ..

##

docker compose down --remove-orphans

docker compose up -d --build
