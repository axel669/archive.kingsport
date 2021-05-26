# Kingsport
Simple AWS Lambda authorizer system for HTTP APIs in ApiGateway

## Usage
1. Configure the bucket name, key files, and urls for the key updater and
    verifier.
    **Note**: current version only checks one key file, will eventually update for
    configurable key sources.
1. Setup a CloudWatch event rule to call the key-updater every hour (or
    however often your token provider suggests).
1. Attach jwt-verifier to a route in an HTTP API using a custom authorizor
