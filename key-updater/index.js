const S3 = require("aws-sdk/clients/s3")
const fetch = require("node-fetch")
const {certToPEM, rsaPublicKeyToPEM} = require("./keygen.js")

const addPublicKey = key => {
    const publicKey = (key.x5c && key.x5c.length)
        ? certToPEM(key.x5c[0])
        : rsaPublicKeyToPEM(key.n, key.e)
    return {
        ...key,
        publicKey,
    }
}

const sources = Object.entries({
    Twitch: "https://id.twitch.tv/oauth2/keys",
})
const s3 = new S3()
const Bucket = "<Your Bucket>"

const updateKey = async ([source, url]) => {
    console.log(`Updating key for: ${source}`)
    const response = await fetch(url)
    const { keys } = await response.json()

    const publicKeys = keys.map(addPublicKey)

    await s3.putObject({
        Bucket,
        Key: `${source}.json`,
        Body: JSON.stringify(publicKeys, null, 4),
    }).promise()
}

exports.handler = async event => {
    await Promise.all(
        sources.map(updateKey)
    )

    return {
        statusCode: 200,
        body: JSON.stringify("Done"),
    }
}
