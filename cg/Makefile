NS = cleargdpr
VERSION ?= latest

REPO = cg
NAME = cg
INSTANCE = default
PORTS = -p 8082:8082
ENV = \
  -e ENVIRONMENT=development

.PHONY: build push shell tag-latest release

build:
	docker build -t $(NS)/$(REPO):$(VERSION) .

push:
	docker push $(NS)/$(REPO):$(VERSION)

tag-latest:
	docker tag $(NS)/$(REPO):$(VERSION) $(NS)/$(REPO):latest

shell:
	docker run --rm --name $(NAME)-$(INSTANCE) -i -t $(PORTS) $(VOLUMES) $(ENV) $(NS)/$(REPO):$(VERSION) /bin/bash

release: build
	make push -e VERSION=$(VERSION)

default: build
