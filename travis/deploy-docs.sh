#! /bin/bash
mkdir -p .docs
tar cf - --exclude='./node_modules' **/*.md | (cd .docs; tar xf -)
tar cf - --exclude='./node_modules' *.md | (cd .docs; tar xf -)
cp -r docs ./.docs/docs
cp *.png ./.docs/
cp index.html ./.docs/

aws s3 ls s3://clear-gdpr-com
aws s3 sync .docs $S3_DOCS_DESTINATION