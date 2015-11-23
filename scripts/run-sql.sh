#!/bin/bash

if [ -f "$1" ];
then
  psql "$DATABASE_URL" -f "$1"
else
  psql "$DATABASE_URL" -c "$1"
fi
