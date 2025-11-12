import consolidateData from './consolidate-data.js'
const data = {
    "sts": 200,
    "msg": "Data retrieved successfully.",
    "data": [
        {
            "_id": "670e0b0f8f3a8eaa5b02c201",
            "level": "Beginner",
            "levelNumber": 1,
            "original": true
        },
        {
            "_id": "670e0b0f8f3a8eaa5b02c202",
            "level": "Basic",
            "levelNumber": 2,
            "original": true
        },
        {
            "_id": "670e0b0f8f3a8eaa5b02c203",
            "level": "Skillful",
            "levelNumber": 3,
            "original": true
        },
        {
            "_id": "670e0b0f8f3a8eaa5b02c204",
            "level": "Advanced",
            "levelNumber": 4,
            "original": true
        },
        {
            "_id": "670e0b0f8f3a8eaa5b02c205",
            "level": "Expert",
            "levelNumber": 5,
            "original": true
        }
    ],
    "db_name": "list_levels"
}
consolidateData._storeKeyValuesToEnv(data, {numOfItems:2})