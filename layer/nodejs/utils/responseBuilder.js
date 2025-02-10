
const responseBuilder = {
    success: (data, statusCode = 200) => {
        return {
            statusCode,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };
    },
    error: (message, statusCode = 400, error = null) => {
        return {
            statusCode,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message,
                error: error?.message || error
            })
        };
    }
}

module.exports = responseBuilder;