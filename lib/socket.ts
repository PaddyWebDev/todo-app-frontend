import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!); // Specify the server URL

export default socket;
