import { useCallback, useEffect, useState } from "react";
import io from 'socket.io-client';


import { SERVER_BASE_URL } from "../constants/apiConstants";

export const useSocket = (
  boardId,
  boardId) => {
  const [socket, setSocket] = useState();
  const [socketResponse, setSocketResponse] = useState({
    userId: userId,
    userName: userName,
    roomId: roomId,
  });
  const [isConnected, setConnected] = useState(false);

  const addCard = useCallback(
    (payload) => {
      socket.emit("add_card", {
        boardId: boardId,
        status: payload.status,
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
      //console.info('useSocket - Connected to the server');
      setConnected(true);
    })

    socketio.on('error', (error) => {
      //console.error('useSocket - Error: ', error);
    });

    socketio.on('connect_error', (error) => {
      //console.error('useSocket - Connection error:', error);
    });

    socketio.on("data_board", (res) => {
      setSocketResponse(res)
    });

    return () => {
      socketio.disconnect();
    };
  }, [roomId]);

  return { socketResponse, isConnected, addCard };
};