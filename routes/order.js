const express = require('express');
const router = express.Router()
const paypal = require('@paypal/checkout-server-sdk');

const payPalClient = (credentials, env) => {
    const { clientID, clientSecret } = credentials

    const { SandboxEnvironment, LiveEnvironment, PayPalHttpCLient } = paypal.core
    const ppEnvironment = (env==='dev') ? new SandboxEnvironment(clientID, clientSecret) : new LiveEnvironment(clientID, clientSecret)

    return new PayPalHttpCLient(ppEnvironment)
}

router.post('/create', async (req, res, next) => {
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: '5.00'
                }
            }
        ]
    })
    try {
        const credentials = {
            clientId: process.env.PP_CLIENT_ID,
            clientSecret: process.env.PP_CLIENT_SECRET
        }
        const order = await payPalClient(credentials, 'dev').execute(request)
        res.json({
            orderID: order.result.id
        })

    } catch (error) {
        res.json({
            confirmation: 'fail',
            message: error.message
        })
    }

})

module.exports = router