#!/bin/bash

reset

clear

set -e

set -x

docker-compose down 

docker-compose up --build
