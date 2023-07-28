import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
dotenv.config({ path: `${__dirname}/config.env` })

import express from "express"
import { Server as SocketServer } from "socket.io";
import axios from "axios"
import cors from "cors"
import http from "http"
import cookie from "cookie"
import { userArr, userEvents } from "./events/oAuth.js";
import dotenv from "dotenv"
import { geUserByUserId } from './events/helpers/adduser.js';



const app = express()
const port = 7000

const bearerToken = "AAAAAAAAAAAAAAAAAAAAAGj7owEAAAAAVAy%2FtxcOgUtxUkJ7YUhqHBkD0Jo%3DZTAv1IZZSI4DOfDIYj7dPEAX6YakcN8NbKWLjl2Zs5k26BimHx"
const dashboardAccessToken = "921758950982344706-DXEWG5k2ZaSTP9gCVKu4adTFIDu3BHN"
const dashboardSecretAccessToken = "F0FZImjl7uIqi1QQISkgYOGOlRQcssO2l3qkIFimAYX1V"
const API_KEY = 'auTTfjc2ai63Ipba9nuaQJMaG';
const API_SECRET = 'qPApvOi4M392JTNDlaDEJPh98gnNrInu1FP6QRnrnZDISTpfc6';
const server = http.createServer(app)


app.use(cors());

export const io = new SocketServer(server,
    {
        cors: {
            origin: ["http://localhost:3000", `${process.env?.BASE_URL}`],
            //Update first url with frontend in production
            credentials: true,
        }
    }
);
userEvents(io)
app.get("/api/login/oauth/twitter", async (req, res) => {
    // console.log(req.query)
    const CLIENT_SECRET = 't42O5smtwE8a1ZJb-i4-ewBShM_99pfaJfRrPWNdh3O3-meuxJ';
    const CLIENT_ID = "OHBPczkwZ2Z3NGg2SzRnX3pZb0U6MTpjaQ"

    // const KHIZAR_CLIENT_ID = 'dmNsZmx2ZEV5bW1UZ2RuZnFKMHA6MTpjaQ';
    // const KHIZAR_CLIENT_SECRET = 's0Tz-EMnfJhmIXo-WaWu8pmiFWmt3lIPBvZDdG01Wf6q82z9Ou';
    const KHIZAR_CLIENT_ID = 'Z2xyZ0lBQVVlbmRUUDIzMEpZS086MTpjaQ';
    const KHIZAR_CLIENT_SECRET = 'w2DCyaC1rWuN0nvOpfbW2WTXHqawgbJxoMSyG06vkHoFUJWJt4';

    const encodedCredentials = Buffer.from(`${KHIZAR_CLIENT_ID}:${KHIZAR_CLIENT_SECRET}`, "utf8").toString('base64');
    const url = 'https://api.twitter.com/2/oauth2/token';


    const twitterOauthTokenParams = {
        client_id: KHIZAR_CLIENT_ID,
        code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
        redirect_uri: `${process.env.BASE_URL}/oauth/twitter`,
        grant_type: "authorization_code",
        code: req.query.code
    };

    try {

        const response = await axios.post(url,
            new URLSearchParams({ ...twitterOauthTokenParams }).toString()
            , {
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
            })


        if (response?.data?.access_token) {

            const userResponse = await axios.get("https://api.twitter.com/2/users/me", {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${response?.data?.access_token}`,
                },
            })

            // const cookieOptions = { httpOnly: true, maxAge: 86400 }; // Set your desired cookie options
            // const myCookie = cookie.serialize('myCookieName', 'cookieValue', cookieOptions);
            const user = geUserByUserId(userArr, req.query?.state)
            const userData = { ...userResponse?.data?.data, access_token: response?.data?.access_token }
            // io.request.cookies.newCookieName = 'newCookieValue';
            console.log("user", user)
            io.to(user?.socketId).emit("login-user-success", userData)
            res.json(userData)
        }

    } catch (error) {
        console.log(error?.response?.data)
        const user = geUserByUserId(userArr, req.query?.state)

        io.to(user?.socketId).emit("login-user-error")
        res.status(500).json(error)
    }


})
app.get("/", (req, res) => {
    res.json({ message: "hello" })
})

server.listen(port, () => {
    console.log(`server is listening at port ${port}`)
})