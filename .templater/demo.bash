#!/bin/bash

##

sourceDirectory="../proving-grounds"

appName="workr/updatr.py"

demoFile="../cascadr-demo.html"

##

reset

clear

##

set -e

set -x

##

echo
echo "start cascade template design"
echo

##

python3 $appName $demoFile
