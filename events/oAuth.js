import { AddUserToArr } from "./helpers/adduser.js";

export let userArr = [];

export function userEvents(io) {
    io.on('connection', (socket) => {
        socket.on('save-user', (props) => {
            console.log(props)
            const newUser = { ...props, socketId: socket?.id }
            userArr = AddUserToArr(userArr, newUser);
        });
        socket.on('set-cookies-after-login', (props) => {
            // console.log(socket.handshake)
        });

    })
}