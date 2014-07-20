#!/bin/bash
# Rename files to prepare for upload
# Make sure everything is checked into Git first!
# Only use this on OSX with default sed, sed works differently elsewhere!

echo -e "Script made by Jason Liu, July 2014\n"

git --version 2>&1 >/dev/null
if [ $? -ne 0 ]; then
  echo "Git is not available on your system. Please install it."
  exit
fi

orig="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo -e "Running in: $orig, ensure that VPN is on\n"

echo -e "Step 1: Deleting _site folder\n"
rm -rf _site/

echo -e "Step 2: Files to replace:"
grep -riInl "jasonkliu.github.io" * --exclude-dir=_site --exclude=*.sh
echo ""

sed -i '' 's/jasonkliu.github.io/yale.edu/' index.md
sed -i '' 's/jasonkliu.github.io/yale.edu/' _config.yml
sed -i '' 's/jasonkliu.github.io/yale.edu/' _includes/head.html

echo -e "Step 3: Type your netid (no spaces); it is not stored anywhere"
read netid

echo ""
echo "Doing a dry run of the upload from rsync. -avz is recursive archive with"
echo "compression, --delete removes extraneous files on destination, --dry-run"
echo -e "shows just the files being moved, -i gives a summary, and -h is human.\n"

rsync -avz --delete --dry-run -i -h * $netid@elsinore.cis.yale.edu:/home/demos/git

echo -e "Step 4: Are you happy with the files changed? Press 1 for yes or else operation will stop\n"
read yesno

if [ "1" == "$yesno" ]; then
  echo -e "Sending files...\n"
  rsync -avz --delete -i -h * $netid@elsinore.cis.yale.edu:/home/demos/git
else
  echo -e "Reverting files back to original...\n"
  git checkout .
fi
