import React, { createContext, useContext, useEffect, useRef } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const webSocket = useRef(null);

    useEffect(() => {
        webSocket.current = new WebSocket('ws://localhost:8000/ws/nike_updates/');

        webSocket.current.onopen = () => {
            console.log('WebSocket connection established.');
        };

        webSocket.current.onmessage = event => {
            const data = JSON.parse(event.data);
            if (data.type === 'nike.update') {
                console.log('Received Nike update:', data.message);
            }
        };

        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={webSocket.current}>
            {children}
        </WebSocketContext.Provider>
    );
};