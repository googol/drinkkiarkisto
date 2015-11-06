#!/bin/bash

export PGPASSWORD=vagrant

if [ -f "$1" ];
then
  psql vagrant vagrant -f "$1"
else
  psql vagrant vagrant -c "$1"
fi
