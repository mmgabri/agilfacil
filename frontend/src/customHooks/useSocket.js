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

  //poker
  const updateStatusRoom = useCallback(
    (payload) => {
      socket.emit("comand_socket_poker", {
        comand: 'update_status_room',
        roomId: idSession,
        status: payload.status,
      });
    },
    [socket, idSession]
  );


  const votar = useCallback(
    (payload) => {
      socket.emit("comand_socket_poker", {
        comand: 'votar',
        roomId: idSession,
        userId: userId,
        userName: userName,
        vote: payload.vote,

      });
    },
    [socket, idSession]
  );


  //board
  const addCardSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'add_card_board',
        boardId: idSession,
        newCard: payload.newCard,
        indexColumn: payload.indexColumn
      });
    },
    [socket, idSession]
  );


  const reorderBoardSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'reorder_board',
        boardId: idSession,
        source: payload.source,
        destination: payload.destination
      });
    },
    [socket, idSession]
  );

  const combineCardSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'combine_card',
        boardId: idSession,
        source: payload.source,
        combine: payload.combine
      });
    },
    [socket, idSession]
  );

  const deleteColumnSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'delete_column',
        boardId: idSession,
        index: payload.index,
      });
    },
    [socket, idSession]
  );



  const setIsObfuscatedBoardLevelSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'set_is_obfuscated_board_level',
        boardId: idSession,
        isObfuscated: payload.isObfuscated,
      });
    },
    [socket, idSession]
  );

  const setIsObfuscatedColumnLevelSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'set_is_obfuscated_column_level',
        boardId: idSession,
        isObfuscated: payload.isObfuscated,
        index: payload.index
      });
    },
    [socket, idSession]
  );

  const addCollumnSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'add_collumn',
        boardId: idSession,
        newCollumn: payload.newCollumn,
      });
    },
    [socket, idSession]
  );

  const updateTitleColumnSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'update_title_column',
        boardId: idSession,
        content: payload.content,
        index: payload.index
      });
    },
    [socket, idSession]
  );

  const updatecolorCardsSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'update_color_cards',
        boardId: idSession,
        colorCards: payload.colorCards,
        index: payload.index
      });
    },
    [socket, idSession]
  );

  const updateLikeSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'update_like',
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
      socket.emit("comand_socket_board", {
        comand: 'delete_card',
        boardId: idSession,
        indexCard: payload.indexCard,
        indexColumn: payload.indexColumn
      });
    },
    [socket, idSession]
  );

  const deleteAllCardSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'delete_all_card',
        boardId: idSession,
        indexColumn: payload.indexColumn
      });
    },
    [socket, idSession]
  );

  const saveCardSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'save_card',
        boardId: idSession,
        content: payload.content,
        indexCard: payload.indexCard,
        indexColumn: payload.indexColumn,
      });
    },
    [socket, idSession]
  );

  const timerControlSocket = useCallback(
    (payload) => {
      socket.emit("comand_socket_board", {
        comand: 'timer_control_board',
        boardId: idSession,
        timeInput: payload.timeInput,
        timer: payload.timer,
        isRunningTimer: payload.isRunningTimer,
        userId: payload.userId,
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
      // console.info('useSocket - Connected to the server');
      setConnected(true);
    })

    socketio.on('error', (error) => {
      console.error('useSocket - Error: ', error);
    });

//    socketio.on('connect_error', (error) => {
//      console.error('useSocket - Connection error:', error);
//    });

    socketio.on("data_room", (res) => {
      setSocketResponse(res)
    });

    socketio.on("data_board", (res) => {
      //   console.log('socket -->', res)
      setSocketResponse(res)
    });

   // socketio.on("retro_connection", (res) => {
   //   console.log('retro_connection -->', res)
      //    setSocketResponse(res)
  //  });

  //  socketio.on("retro_disconnect", (res) => {
  //    console.log('socket-retro_disconnect -->', res)
  //  });

    return () => {
      socketio.disconnect();
    };
  }, [idSession]);

  return {
    socketResponse,
    isConnected,
    updateStatusRoom,
    votar,
    addCardSocket,
    reorderBoardSocket,
    combineCardSocket,
    deleteColumnSocket,
    updateTitleColumnSocket,
    updateLikeSocket,
    deleteCardSocket,
    addCollumnSocket,
    saveCardSocket,
    updatecolorCardsSocket,
    deleteAllCardSocket,
    timerControlSocket,
    setIsObfuscatedBoardLevelSocket,
    setIsObfuscatedColumnLevelSocket
  };
};