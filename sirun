#!/bin/bash

PATH1=$0
DIR="$( cd "$( dirname "$0" )" && pwd )"
PORT1=$2
(( PORT2 = $2+1 ))
(( PORT3 = $2+2 ))
(( PORT4 = $2+3 ))

rm ~/.mozilla/firefox/*.default/*.sqlite ~/.mozilla/firefox/*.default/sessionstore.js
rm -r ~/.cache/mozilla/firefox/*.default/*

if [ $1 = 1 ]
then
	cd $DIR/'project_SI (all lenghts fixed)'/
	i3-sensible-terminal -e "firefox --private --new-tab 0.0.0.0:$2" &
	python -m SimpleHTTPServer $2 
fi

if [ $1 = 2 ]
then
	cd $DIR/'project_SI SIMPLE MODE'/
	i3-sensible-terminal -e "firefox --private --new-tab 0.0.0.0:$2" &
	python -m SimpleHTTPServer $2 
fi

if [ $1 = 3 ]
then
	cd $DIR/'project_SI (completely random)'/
	i3-sensible-terminal -e "firefox --private --new-tab 0.0.0.0:$2" &
	python -m SimpleHTTPServer $2
fi

if [ $1 = 4 ]
then
	cd $DIR/'project_SI TRAINER MODE'/
	i3-sensible-terminal -e "firefox --private --new-tab 0.0.0.0:$2" &
	python -m SimpleHTTPServer $2
fi



if [ $1 = 5 ]
then
 	i3-sensible-terminal -e "$PATH1 1 $PORT1" &
 	i3-sensible-terminal -e "$PATH1 2 $PORT2" &
 	i3-sensible-terminal -e "$PATH1 3 $PORT3" &
 	i3-sensible-terminal -e "$PATH1 4 $PORT4" &
fi


# 	i3-sensible-terminal -e "~/Documents/universidad/SI/SI_Project-master/run.sh 1 8000"
