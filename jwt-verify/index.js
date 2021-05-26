const S3 = require("aws-sdk/clients/s3")
const jwt = require("jsonwebtoken")

const s3 = new S3()

const keyFile = s3.getObject({
    Bucket: "<Your Bucket>",
    Key: "<Your Keyfile>"
}).promise()

exports.handler = async (event) => {
    const keyInfo = JSON.parse(
        (await keyFile).Body.toString("utf8")
    )
    try {
        const authHeader = (
            event.headers.Authorization
            || event.headers.authorization
            || event.headers.auth
        )
        const userJWT = authHeader.split(" ")[1]
        const userInfo = jwt.verify(
            userJWT,
            keyInfo[0].publicKey
        )
        console.log("Auth:", userInfo.preferred_username)
        return {
            isAuthorized: true
        }
    }
    catch (error) {
        console.error(error)
    }

    console.log("invalid user?")
    return {
        isAuthorized: false,
    }
}
