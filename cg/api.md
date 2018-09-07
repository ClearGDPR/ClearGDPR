<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [ClearGDPR - GDPR Compliance Solution](#cleargdpr---gdpr-compliance-solution)
- [Group Management](#group-management)
  - [Login [/management/users/login]](#login-managementuserslogin)
    - [Login [POST]](#login-post)
  - [Deploy contract [/management/contract/deploy]](#deploy-contract-managementcontractdeploy)
    - [Deploy contract [POST]](#deploy-contract-post)
  - [Contract details [/management/contract/details]](#contract-details-managementcontractdetails)
    - [Contract details [GET]](#contract-details-get)
  - [List subjects [/management/subjects/list]](#list-subjects-managementsubjectslist)
    - [List subjects [GET]](#list-subjects-get)
  - [List Rectification Requests [/management/subjects/rectification-requests/list]](#list-rectification-requests-managementsubjectsrectification-requestslist)
    - [List Rectification Requests [GET]](#list-rectification-requests-get)
  - [List Processed Rectification Requests [/management/subjects/rectification-requests/archive]](#list-processed-rectification-requests-managementsubjectsrectification-requestsarchive)
    - [List Processed Rectification Requests [GET]](#list-processed-rectification-requests-get)
  - [Fetch a Rectification request [/management/subjects/rectification-requests/{rectificationRequestId}]](#fetch-a-rectification-request-managementsubjectsrectification-requestsrectificationrequestid)
    - [Fetch a Rectification request [GET]](#fetch-a-rectification-request-get)
  - [Update Rectification Request status [/management/subjects/rectification-requests/{rectificationRequestId}/update-status]](#update-rectification-request-status-managementsubjectsrectification-requestsrectificationrequestidupdate-status)
    - [Update Rectification Request status [POST]](#update-rectification-request-status-post)
  - [List processors [/management/processors/list]](#list-processors-managementprocessorslist)
    - [List processors [GET]](#list-processors-get)
  - [Add a processor [/management/processors/add]](#add-a-processor-managementprocessorsadd)
    - [Add a processor [POST]](#add-a-processor-post)
  - [Update a processor [/management/processors/update]](#update-a-processor-managementprocessorsupdate)
    - [Update a processor [POST]](#update-a-processor-post)
  - [Remove a processor [/management/processors/remove]](#remove-a-processor-managementprocessorsremove)
    - [Remove a processor [POST]](#remove-a-processor-post)
  - [Register an user [/management/users/register]](#register-an-user-managementusersregister)
    - [Register an user [POST]](#register-an-user-post)
  - [Remove an user [/management/users/{userId}/remove]](#remove-an-user-managementusersuseridremove)
    - [Remove an user [POST]](#remove-an-user-post)
  - [Update user's password [/management/users/{userId}/update-password]](#update-users-password-managementusersuseridupdate-password)
    - [Update user's password [POST]](#update-users-password-post)
  - [List users [/management/users/list]](#list-users-managementuserslist)
    - [List users [GET]](#list-users-get)
  - [Get stats [/management/stats]](#get-stats-managementstats)
    - [Get stats [GET]](#get-stats-get)
- [Group Processors](#group-processors)
  - [Contract details [/processors/contract/details]](#contract-details-processorscontractdetails)
    - [Contract details [GET]](#contract-details-get-1)
  - [Get Subject data [/processors/subject/{subjectId}/data]](#get-subject-data-processorssubjectsubjectiddata)
    - [Get Subject data [GET]](#get-subject-data-get)
  - [Get Subject restrictions [/processors/subject/{subjectId}/get-restrictions]](#get-subject-restrictions-processorssubjectsubjectidget-restrictions)
    - [Get Subject restrictions [GET]](#get-subject-restrictions-get)
  - [Get Subject objection [/processors/subject/{subjectId}/get-objection]](#get-subject-objection-processorssubjectsubjectidget-objection)
    - [Get Subject objection [GET]](#get-subject-objection-get)
- [Group Subjects](#group-subjects)
  - [Get processors [/subjects/processors]](#get-processors-subjectsprocessors)
    - [Get processors [GET]](#get-processors-get)
  - [Share data share [/subjects/data-shares/share]](#share-data-share-subjectsdata-sharesshare)
    - [Share data share [GET]](#share-data-share-get)
  - [Give consent [/subjects/give-consent]](#give-consent-subjectsgive-consent)
    - [Give consent [POST]](#give-consent-post)
  - [Update consent [/subjects/update-consent]](#update-consent-subjectsupdate-consent)
    - [Update consent [POST]](#update-consent-post)
  - [Access data [/subjects/access-data]](#access-data-subjectsaccess-data)
    - [Access data [GET]](#access-data-get)
  - [Get personal data status [/subjects/data-status]](#get-personal-data-status-subjectsdata-status)
    - [Get personal data status [GET]](#get-personal-data-status-get)
  - [Initiate Rectification [/subjects/initiate-rectification]](#initiate-rectification-subjectsinitiate-rectification)
    - [Initiate Rectification [POST]](#initiate-rectification-post)
  - [Restrict [/subjects/restrict]](#restrict-subjectsrestrict)
    - [Restrict [POST]](#restrict-post)
  - [Get restrictions [/subjects/get-restrictions]](#get-restrictions-subjectsget-restrictions)
    - [Get restrictions [GET]](#get-restrictions-get)
  - [Object [/subjects/object]](#object-subjectsobject)
    - [Object [POST]](#object-post)
  - [Get objection [/subjects/get-objection]](#get-objection-subjectsget-objection)
    - [Get objection [GET]](#get-objection-get)
  - [Create data share [/subjects/data-shares/create]](#create-data-share-subjectsdata-sharescreate)
    - [Create data share [POST]](#create-data-share-post)
  - [List data shares [/subjects/data-shares/list]](#list-data-shares-subjectsdata-shareslist)
    - [Get objection [GET]](#get-objection-get-1)
  - [Remove data share [/subjects/data-shares/{dataShareId}/remove]](#remove-data-share-subjectsdata-sharesdatashareidremove)
    - [Remove data share [POST]](#remove-data-share-post)
  - [Erase data [/subjects/erase-data]](#erase-data-subjectserase-data)
    - [Erase data [POST]](#erase-data-post)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

FORMAT: 1A

# ClearGDPR - GDPR Compliance Solution
This is the introduction

# Group Management

## Login [/management/users/login]
### Login [POST]

+ Request (application/json)

            {
                "username": {username} (String),
                "password": {password} (String)
            }

+ Response 200 (application/json)

            {
                "jwt": {token} (String)
            }

## Deploy contract [/management/contract/deploy]
### Deploy contract [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
                "contractByteCode": {contractByteCode} (String),
                "contractAbiJson": {contractAbiJson} (String(JSON))
            }

+ Response 200 (application/json)

    + Body

            {
                "address": {address} (String)
            }

## Contract details [/management/contract/details]
### Contract details [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

+ Response 200 (application/json)

    + Body

            {
                "address": {address} (String),
                "contractAbiJson": {contractAbiJson} (String(JSON)),
                "contractByteCode": {contractByteCode} (String)
            }

## List subjects [/management/subjects/list]
### List subjects [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

+ Response 200 (application/json)

    + Body

            {
                "data": [
                    {
                        "data": {
                            "firstName": {firstName} (String),
                            "email": {email} (String),
                            "sensitiveData": {sensitiveData} (String)
                        },
                        "id": {id} (String),
                        "createdAt": (String (Date))
                    }
                ],
                "paging": {
                    "current": {current} (Number),
                    "total": {total} (Number)
                }
            }

## List Rectification Requests [/management/subjects/rectification-requests/list]
### List Rectification Requests [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

+ Response 200 (application/json)

    + Body

            {
                "data": [
                    {
                        "id": {id} (Number),
                        "request_reason": {request_reason} (String),
                        "created_at": (String(Date))
                    }
                ],
                "paging": {
                    "current": {current} (Number),
                    "total": {total} (Number)
                }
            }

## List Processed Rectification Requests [/management/subjects/rectification-requests/archive]
### List Processed Rectification Requests [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

+ Response 200 (application/json)

    + Body

            {
                "data": [
                    {
                        "id": {id} (Number),
                        "request_reason": {request_reason} (String),
                        "created_at": (String(Date))
                    }
                ],
                "paging": {
                    "current": {current} (Number),
                    "total": {total} (Number)
                }
            }

## Fetch a Rectification request [/management/subjects/rectification-requests/{rectificationRequestId}]
### Fetch a Rectification request [GET]

+ Parameters

    + rectificationRequestId (number) - Rectification Request Id

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

+ Response 200 (application/json)

    + Body

            {
                "id": 1,
                "currentData": {
                    "firstName": {firstName} (String),
                    "email": {email} (String),
                    "sensitiveData": {sensitiveData} (String)
                },
                "updates": {
                    "firstName": {firstName} (String),
                    "email": {email} (String),
                    "sensitiveData": {sensitiveData} (String)
                    "rectifiedData": {rectifiedData} (String)
                },
                "createdAt": {createdAt} (String(Date)),
                "status": {status} (String)
            }

## Update Rectification Request status [/management/subjects/rectification-requests/{rectificationRequestId}/update-status]
### Update Rectification Request status [POST]

+ Parameters

    + rectificationRequestId (number) - Rectification Request Id

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
    
    + Body

            {
                "status": "APPROVED"
            }
            
+ Response 200 (application/json)

    + Body

            {
                // BUG!!!
            }

## List processors [/management/processors/list]
### List processors [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
+ Response 200 (application/json)

    + Body

            [
                {
                    "id": {id} (Number),
                    "name": {name} (String),
                    "logoUrl": {logo} (String),
                    "description": {description} (String),
                    "scopes": {scopes} (Array[ {field} (String) ]),
                    "address": {address} (String)
                },
                ...
            ]

## Add a processor [/management/processors/add]
### Add a processor [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
                "name": {name} (String),
                "logoUrl": {logoUrl} (String),
                "description": {description} (String),
                "address": {address} (String)
            }

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## Update a processor [/management/processors/update]
### Update a processor [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
                "id": {id} (Number),
                "name": {name} (String),
                "logoUrl": {logoUrl} (String),
                "description": {description} (String),
                "scopes": {scrope} (Array[ {field} (String) ])
            }

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## Remove a processor [/management/processors/remove]
### Remove a processor [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
                "processorIds": {processorIds} (Array[ {id} (Number) ])
            }

+ Response 200 (application/json)

    + Body

            {
                //BUG!!!
            }

## Register an user [/management/users/register]
### Register an user [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
              "username": {username} (String),
              "password": {password}  (String)"
            }

+ Response 200 (application/json)

    + Body

            {
                "id": {id} (Number),
                "username": {username} (String)
            }

## Remove an user [/management/users/{userId}/remove]
### Remove an user [POST]

+ Parameters

    + userId (number) - User Id

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

    + Body

            {
              "username": {username} (String),
              "password": {password} (String)
            }

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## Update user's password [/management/users/{userId}/update-password]
### Update user's password [POST]

+ Parameters

    + userId (number) - User Id

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
                "password": {password} (String)
            }

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## List users [/management/users/list]
### List users [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
+ Response 200 (application/json)

    + Body

            [
                {
                    "id": {id} (Number),
                    "username": {username} (String)
                },
                ...
            ]

## Get stats [/management/stats]
### Get stats [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
+ Response 200 (application/json)

    + Body

            {
                "data": {
                    "controller": {
                        "consented": {consented} (Number),
                        "unconsented": {unconsented} (Number),
                        "total": {total} (Number)
                    },
                    "processors": {
                        "1": {
                            "consented": {consented} (Number),
                            "name": {name} (String)
                        },
                        ...
                    }
                }
            }
            
# Group Processors

## Contract details [/processors/contract/details]
### Contract details [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
+ Response 200 (application/json)

    + Body

            {
                "address": "0xC1C040FebECCBbE0Be29613D234A594A487107Cb"
            }

## Get Subject data [/processors/subject/{subjectId}/data]
### Get Subject data [GET]

+ Parameters

    + subjectId (number) - Subject Id

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
    

+ Response 200 (application/json)

    + Body

            {
                //BUG!!!
            }


## Get Subject restrictions [/processors/subject/{subjectId}/get-restrictions]
### Get Subject restrictions [GET]


+ Parameters

    + subjectId (number) - Subject Id

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body
+ Response 200 (application/json)

    + Body

            {
                //BUG!!!
            }


## Get Subject objection [/processors/subject/{subjectId}/get-objection]
### Get Subject objection [GET]

+ Parameters

    + subjectId (number) - Subject Id

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

+ Response 200 (application/json)

    + Body

            {
                //BUG!!!
            }

# Group Subjects

## Get processors [/subjects/processors]
### Get processors [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
+ Response 200 (application/json)

    + Body

            [
                {
                    "id": {id} (Number),
                    "name": {name} (String),
                    "logoUrl": {logo} (String),
                    "description": {description} (String),
                    "scopes": {scopes} (Array[ {field} (String) ]),
                    "address": {address} (String)
                },
                ...
            ]


## Share data share [/subjects/data-shares/share]
### Share data share [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
+ Response 200 (application/json)

    + Body

            {
                // BUG!!!
            }


## Give consent [/subjects/give-consent]
### Give consent [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
                "personalData": {
                    "firstName": {firstName} (String),
                    "email": {email} (String),
                    "sensitiveData": {sensitiveData} (String)
                },
                "processors": {processors} (Array[ {id} (Number) ])
            }

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## Update consent [/subjects/update-consent]
### Update consent [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body
    
            {
                "processors": {processors} (Array[ {id} (Number) ])
            }

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## Access data [/subjects/access-data]
### Access data [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

+ Response 200 (application/json)

    + Body

            {
                "firstName": {firstName} (String),
                "email": {email} (String),
                "sensitiveData": {sensitiveData} (String),
                "rectifiedData": {rectifiedData} (String)
            }


## Get personal data status [/subjects/data-status]
### Get personal data status [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

+ Response 200 (application/json)

    + Body

            {
                "controller": {controller} (Number),
                "processors": [
                    {
                        "id": {id} (Number),
                        "status": {status} (Number)
                    }
                ]
            }

## Initiate Rectification [/subjects/initiate-rectification]
### Initiate Rectification [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
                "rectificationPayload": {
                    "firstName": {firstName} (String),
                    "email": {email} (String),
                    "sensitiveData": {sensitiveData} (String),
                    "rectifiedData": {rectifiedData} (String),
                },
                "requestReason": {requestReason} (String),
            }

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## Restrict [/subjects/restrict]
### Restrict [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body

            {
                "directMarketing": {directMarketing} (Boolean),
                "emailCommunication": {emailCommunication} (Boolean)
                "research": {research} (Boolean)
            }

+ Response 200 (application/json)

    + Body

            {
                // BUG!!!
                // {
                //    "error": "this.contract.methods[methodName] is not a function"
                // }
            }

## Get restrictions [/subjects/get-restrictions]
### Get restrictions [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
+ Response 200 (application/json)

    + Body

            {
                "directMarketing": {directMarketing} (Boolean),
                "emailCommunication": {emailCommunication} (Boolean),
                "research":  {research} (Boolean)
            }

## Object [/subjects/object]
### Object [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}
        
    + Body
    
            {
                "objection": true
            }

+ Response 200 (application/json)

    + Body

            {
                // BUG!!!
                // {
                //    "error": "this.contract.methods[methodName] is not a function"
                // }
            }

## Get objection [/subjects/get-objection]
### Get objection [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

+ Response 200 (application/json)

    + Body
            
            {
                "objection": {objection} (Boolean)
            }

## Create data share [/subjects/data-shares/create]
### Create data share [POST]
+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

    + Body

            {
                "name": "My data-share"
            }

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## List data shares [/subjects/data-shares/list]
### Get objection [GET]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

+ Response 200 (application/json)

    + Body

            [
                {
                    "id": {id} (Number),
                    "name": {name} (String)
                    "token": {token} (String),
                    "url": {url} (String),
                }
            ]

## Remove data share [/subjects/data-shares/{dataShareId}/remove]
### Remove data share [POST]

+ Parameters

    + dataShareId (number) - Data share Id

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}

+ Response 200 (application/json)

    + Body

            {
                "success": true
            }

## Erase data [/subjects/erase-data]
### Erase data [POST]

+ Request (application/json)

    + Headers
    
            Authorization: Bearer {token}


+ Response 200 (application/json)

    + Body

            {
                "success": true
            }


