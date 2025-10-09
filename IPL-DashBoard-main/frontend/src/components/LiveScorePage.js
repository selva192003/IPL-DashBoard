import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Loader from './Loader';

const LiveScorePage = () => {
    const [liveScore, setLiveScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // The backend WebSocket URL is correctly proxied in your package.json
        const socket = new SockJS('/ws');
        
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: (frame) => {
                console.log('Connected to WebSocket:', frame);
                stompClient.subscribe('/topic/live-score', (message) => {
                    const scoreData = JSON.parse(message.body);
                    console.log('Received live score update:', scoreData);
                    setLiveScore(scoreData);
                    setLoading(false);
                });
            },
            onStompError: (frame) => {
                console.error('WebSocket connection error:', frame.headers['message']);
                setError('Failed to connect to the live score service.');
                setLoading(false);
            },
        });

        stompClient.activate();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!liveScore || Object.keys(liveScore).length === 0) {
        return <div className="text-center p-4 text-white">No live match data available.</div>;
    }

    const isScoreAvailable = liveScore.hasOwnProperty('team1Runs');

    return (
        <div className="LiveScorePage p-6 bg-gray-800 rounded-lg shadow-xl text-white max-w-2xl mx-auto my-8">
            <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-400">Live Match Score</h1>
            <div className="text-left space-y-4 text-lg">
                <p><strong>Match:</strong> {liveScore.matchDesc}</p>
                {liveScore.status && <p><strong>Status:</strong> {liveScore.status}</p>}
                {liveScore.stateTitle && <p><strong>Details:</strong> {liveScore.stateTitle}</p>}

                {isScoreAvailable && (
                    <>
                        <h2 className="text-2xl font-bold mt-6 mb-2">Scorecard</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-700 p-4 rounded-md">
                                <p><strong>{liveScore.team1Name}</strong></p>
                                <p>{liveScore.team1Runs}/{liveScore.team1Wickets} ({liveScore.team1Overs} overs)</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-md">
                                <p><strong>{liveScore.team2Name}</strong></p>
                                <p>{liveScore.team2Runs}/{liveScore.team2Wickets} ({liveScore.team2Overs} overs)</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LiveScorePage;