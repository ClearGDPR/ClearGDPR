<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [CG API Specification](#cg-api-specification)
  - [Introduction](#introduction)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
    - [OAuth2 token (JWT)](#oauth2-token-jwt)
  - [Parameters](#parameters)
  - [Errors](#errors)
  - [Support](#support)
  - [Endpoints](#endpoints)
    - [Subjects](#subjects)
      - [GET Request Access](#get-request-access)
        - [Headers](#headers)
        - [Example Request](#example-request)
      - [GET Get data status](#get-get-data-status)
        - [Headers](#headers-1)
        - [Example Request](#example-request-1)
      - [DELETE Erase data](#delete-erase-data)
        - [Headers](#headers-2)
        - [Example Request](#example-request-2)
      - [POST Give consent](#post-give-consent)
        - [Headers](#headers-3)
        - [Body](#body)
        - [Example Request](#example-request-3)
      - [GET List processors](#get-list-processors)
        - [Headers](#headers-4)
        - [Example Request](#example-request-4)
        - [Example Response](#example-response)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# CG API Specification

## Introduction

This document describes the CG API. This API enables you to manage all aspects of user data when you use CG as a backend. It offers endpoints so your users can submit new data, retrieve it and manage how and by whom it is processed.

To learn more about ClearGDPR [link to CG implementation]

## Base URL

The CG API is served over HTTPS. All URLs referenced in the documentation have the following base: `https://{{cg_base_url}}/`

## Authentication

The way Authentication is handled is with an OAuth2 Access Token in the Authorization request header field (which uses the Bearer authentication scheme to transmit the Access Token)

### OAuth2 token (JWT)

In this case, you have to send a valid Access Token in the Authorization header, using the Bearer authentication scheme. The token should be used in the Authorization header, in order to retrieve the subjects's profile and allow him to perform different requests.

The token depends on the server side to provide a connection with the customer's identity system.

The JWT payload should have the `subjectId` mandatory as part of how CG backend handles the Subject identity and allow access to the platform and retrieve information later.

> [link to JWT]
> [How to verify a JWT]

## Parameters

For GET requests, any parameters not specified as a segment in the path can be passed as an HTTP query string parameter:

```bash
GET https://{{cg_base_url}}/some-endpoint?param=value&param=value
```

For POST requests, parameters not included in the URL should be encoded as JSON with a Content-Type of application/json:

```bash
curl --request POST \
     --url 'https://{{cg_base_url}}/some-endpoint' \
     --header 'content-type: application/json' \
     --data '{"param": "value", "param": "value"}'
```

## Errors

When an error occurs, you will receive an error object. All error objects have an error code and an error description so that your applications can tell what the problem is.

If you get an 4xx HTTP response code, then you can assume that there is a bad request from your end. In this case, check the Standard Error Responses for more context.

5xx errors suggest a problem on CG API end, so in this case ???.

In any other case you can use our support options.

## Support

You can reach out to us or open an issue on https://github.com/clevertech/ClearGDPR, we will try our best to hep you :)

## Endpoints

[link to postman collection]

### Subjects

#### GET Request Access

Access Subject's data and Processors Ids associated to it.

```
{{cg_base_url}}/api/subject/data
```

##### Headers

| Header | Value |
|----|----|
|Content-Type|`application/json`|

##### Example Request

```
curl --request GET \
  --url 'http://{{cg_base_url}}/api/subject/data' \
  --header 'Content-Type: application/json'
```

#### GET Get data status

Show data status by specific subject ordered by Processor Id

```
{{cg_base_url}}/api/subject/data/status
```

##### Headers

| Header | Value |
|----|----|
|Content-Type|`application/json`|

##### Example Request
```
curl --request GET \
  --url 'http://{{cg_base_url}}/api/subject/data/status' \
  --header 'Content-Type: application/json'
```

#### DELETE Erase data

Delete Subject's data from the backend

```
{{cg_base_url}}/api/subject/data
```

##### Headers

| Header | Value |
|----|----|
|Content-Type|`application/json`|

##### Example Request
```
curl --request DELETE \
  --url 'http://{{cg_base_url}}/api/subject/data' \
  --header 'Content-Type: application/json'
```

#### POST Give consent

Handles right to access of different processors to Subject's data. The list of Processors Ids should be always explicit. The list of all the processors should be fetch from `GET List processors` endpoint.

```
{{cg_base_url}}/api/subject/consent
```

##### Headers

| Header | Value |
|----|----|
|Content-Type|`application/json`|

##### Body

| Field | Type | Description |
|----|----|----|
|`personalData`| Object | Any JSON is allowed, and data is encrypted in the backend
|`processors`| Array | A list of IDs of processors allowed to access subject information

##### Example Request
```
curl --request POST \
  --url 'http://{{cg_base_url}}/api/subject/consent' \
  --header 'Content-Type: application/json' \
  --data '{
	"personalData": {
		"firstName": "Subject Na,e",
		"email": "subject@example.com"
	},
	"processors": [1]
}'
```

#### GET List processors

This endpoint don't needs authentication. Returns the all the Processors entities stored in the backend. The processors list should be threated as payload for all the endpoints that handle permissions for subject's data access management.

```
{{cg_base_url}}/api/subject/processors
```

##### Headers

| Header | Value |
|----|----|
|Content-Type|`application/json`|

##### Example Request
```
curl --request GET \
  --url 'http://{{cg_base_url}}/api/subject/processors' \
  --header 'Content-Type: application/json'
```

##### Example Response

```json
[
	{
		"id": 1,
		"name": "Example Processor",
		"logoUrl": null,
		"description": "This is an example processor",
		"scopes": [
			"email",
			"first name",
			"last name"
		]
	}
]
```
