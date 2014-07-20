#!/bin/bash
# Rename files to prepare for upload
# Make sure everything is checked into Git first!
# Only use this on OSX with default sed, sed works differently elsewhere!

echo "Script made by Jason Liu, July 2014"
echo ""

git --version 2>&1 >/dev/null
if [ $? -ne 0 ]; then
  echo "Git is not available on your system. Please install it."
  read
fi

orig="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Running in: $orig, ensure that VPN is on"
echo ""

echo "Deleting _site folder"
rm -rf _site/

echo "Files to replace: "
grep -riInl "jasonkliu.github.io" * --exclude-dir=_site --exclude=*.sh

sed -i '' 's/jasonkliu.github.io/yale.edu/' index.md
sed -i '' 's/jasonkliu.github.io/yale.edu/' _config.yml
sed -i '' 's/jasonkliu.github.io/yale.edu/' _includes/head.html

