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


