NS = cleargdpr
VERSION ?= latest

REPO = demo-frontend
NAME = demo-frontend
INSTANCE = default
PORTS = -p 3000:3000
ENV = \
  -e NODE_ENV=development

.PHONY: build build-dev push shell test tag-latest run start stop rm release dist

dist:
	yarn --ignore-scripts && yarn run build

build-dev:
	docker build -t $(NS)/$(REPO):$(VERSION) .

build:
	docker build -f Dockerfile-prod -t $(NS)/$(REPO):$(VERSION) .

push:
	docker push $(NS)/$(REPO):$(VERSION)

tag-latest:
	docker tag $(NS)/$(REPO):$(VERSION) $(NS)/$(REPO):latest

shell:
	docker run --rm --name $(NAME)-$(INSTANCE) -i -t $(PORTS) $(VOLUMES) $(ENV) $(NS)/$(REPO):$(VERSION) /bin/bash

release: build
	make push -e VERSION=$(VERSION)

default: build
