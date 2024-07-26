export const user_schema = {
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "__v": {
      "type": "integer"
    }
  },
  "required": [
    "_id",
    "firstName",
    "lastName",
    "email",
    "__v"
  ]
}

export const login_user_schema = {
    "type": "object",
    "properties": {
      "user": user_schema,
      "token": {
        "type": "string"
      }
    },
    "required": [
      "user",
      "token"
    ]
  }