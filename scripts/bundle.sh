#!/bin/bash
COMMAND=browserify
ENTRY_POINT="src/client/main.js"
BROWSERIFY_OPTS="--transform babelify --extension .js --extension .jsx -o public/bundle.js"

if [[ "$1" == "watch" ]]; then
  COMMAND=watchify
  BROWSERIFY_OPTS="$BROWSERIFY_OPTS -v --poll 1000"
fi

mkdir -p public
"$COMMAND" "$ENTRY_POINT" $BROWSERIFY_OPTS
exit 0
