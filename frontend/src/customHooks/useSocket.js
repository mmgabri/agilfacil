import { useCallback, useEffect, useState } from "react";
//import * as io from "socket.io-client";
import io from 'socket.io-client';


import { SERVER_BASE_URL } from "../constants/apiConstants";

export const useSocket = (
  userName,
  userId,
  idSession,
  service) => {
  const [socket, setSocket] = useState();
  const [socketResponse, setSocketResponse] = useState({
    userId: userId,
    userName: userName,
    idSession: idSession,
    service: service
  });
  const [isConnected, setConnected] = useState(false);

  const updateStatusRoom = useCallback(
    (payload) => {
      socket.emit("update_status_room", {
        roomId: idSession,
        status: payload.status,
      });
    },
    [socket, idSession]
  );


  const votar = useCallback(
    (payload) => {
      socket.emit("votar", {
        roomId: idSession,
        userId: userId,
        userName: userName,
        vote: payload.vote,

      });
    },
    [socket, idSession]
  );

  //retro
  const addCardSocket = useCallback(
    (payload) => {
      socket.emit("add_card_board", {
        boardId: idSession,
        newCard: payload.newCard,
        indexColumn: payload.indexColumn
      });
    },
    [socket, idSession]
  );


  const reorderBoardSocket = useCallback(
    (payload) => {
      //     console.log("Emitindo reorder_board com os dados:", {
      //       boardId: idSession,
      //       source: payload.source,
      //       destination: payload.destination
      //     });

      socket.emit("reorder_board", {
        boardId: idSession,
        source: payload.source,
        destination: payload.destination
      });
    },
    [socket, idSession]
  );

  const combineCardSocket = useCallback(
    (payload) => {
      socket.emit("combine_card", {
        boardId: idSession,
        source: payload.source,
        combine: payload.combine
      });
    },
    [socket, idSession]
  );

  const deleteColumnSocket = useCallback(
    (payload) => {
      console.log('deleteColumnSocket -->', deleteColumnSocket)
      socket.emit("delete_column", {
        boardId: idSession,
        index: payload.index,
      });
    },
    [socket, idSession]
  );

  const updateTitleColumnSocket = useCallback(
    (payload) => {
      socket.emit("update_title_column", {
        boardId: idSession,
        content: payload.content,
        index: payload.index
      });
    },
    [socket, idSession]
  );

  const updateLikeSocket = useCallback(
    (payload) => {
      socket.emit("update_like", {
        boardId: idSession,
        isIncrement: payload.isIncrement,
        indexCard: payload.indexCard,
        indexColumn: payload.indexColumn
      });
    },
    [socket, idSession]
  );

  const deleteCardSocket = useCallback(
    (payload) => {
      socket.emit("delete_card", {
        boardId: idSession,
        indexCard: payload.indexCard,
        indexColumn: payload.indexColumn
      });
    },
    [socket, idSession]
  );

  const saveCardSocket = useCallback(
    (payload) => {
      socket.emit("save_card", {
        boardId: idSession,
        content: payload.content,
        indexCard: payload.indexCard,
        indexColumn: payload.indexColumn,
      });
    },
    [socket, idSession]
  );


  useEffect(() => {

    const socketio = io(SERVER_BASE_URL, {
      transports: ['websocket'],
      path: '/socket.io',
      query: `userName=${userName}&userId=${userId}&idSession=${idSession}&service=${service}`,
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

    socketio.on("data_room", (res) => {
      setSocketResponse(res)
    });

    socketio.on("data_board", (res) => {
      setSocketResponse(res)
    });

    socketio.on("retro_connection", (res) => {
      console.log(res)
    });

    socketio.on("retro_disconnect", (res) => {
      console.log(res)
    });

    return () => {
      //console.info('useSocket - Disconnect to the server');
      socketio.disconnect();
    };
  }, [idSession]);

  return { socketResponse, isConnected, updateStatusRoom, votar, addCardSocket, reorderBoardSocket, combineCardSocket, deleteColumnSocket, updateTitleColumnSocket, updateLikeSocket, deleteCardSocket, saveCardSocket };
};