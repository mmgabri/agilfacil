import { useCallback, useEffect, useState } from "react";
//import * as io from "socket.io-client";
import io from 'socket.io-client';


import { SERVER_BASE_URL } from "../constants/apiConstants";

export const useSocket = (
  userName,
  userId,
  roomId) => {
  const [socket, setSocket] = useState();
  const [socketResponse, setSocketResponse] = useState({
    userId: userId,
    userName: userName,
    roomId: roomId,
  });
  const [isConnected, setConnected] = useState(false);

  const updateStatusRoom = useCallback(
    (payload) => {
      socket.emit("update_status_room", {
        roomId: roomId,
        status: payload.status,
      });
    },
    [socket, roomId]
  );


  const votar = useCallback(
    (payload) => {
      socket.emit("votar", {
        roomId: roomId,
        userId: userId,
        vote: payload.vote,
        
      });
    },
    [socket, roomId]
  );


  useEffect(() => {

    const socketio = io(SERVER_BASE_URL, {
      transports: ['websocket'], 
      path: '/socket.io',
      query: `userName=${userName}&userId=${userId}&roomId=${roomId}`,
      withCredentials: true
    });

    setSocket(socketio);

    socketio.on("connect", () => {
      console.log('useSocket - Connected to the server');
      setConnected(true);
    })

    socketio.on('error', (error) => {
      console.log('useSocket - Error: ', error);
    });

    socketio.on('connect_error', (error) => {
      console.error('useSocket - Connection error:', error);
    });

    socketio.on("data_room", (res) => {
      setSocketResponse(res)
    });

    return () => {
      console.log('useSocket - Disconnect to the server');
      socketio.disconnect();
    };
  }, [roomId]);

  return { socketResponse, isConnected, updateStatusRoom, votar };
};