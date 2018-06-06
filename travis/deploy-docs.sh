#! /bin/bash
mkdir -p .docs
tar cf - --exclude='./node_modules' **/*.md | (cd .docs; tar xf -)
tar cf - --exclude='./node_modules' *.md | (cd .docs; tar xf -)
cp -r docs ./.docs/docs
cp *.png ./.docs/
cp index.html ./.docs/

ncftpput -R -v -u $FTP_USERNAME -p $FTP_PASSWORD $FTP_HOST /docs/ ./.docs/*