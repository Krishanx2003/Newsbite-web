'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize Socket.io connection
        const socket = io(SOCKET_URL, {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('Connected to notification service:', socket.id);
        });

        socket.on('notification', (data: { title: string; body: string; data?: any }) => {
            console.log('Received notification:', data);

            // Show toast notification
            toast(data.title, {
                description: data.body,
                action: {
                    label: 'View',
                    onClick: () => {
                        // Handle click (navigate to article/news)
                        console.log('Notification clicked:', data);
                        if (data.data?.type === 'article' && data.data?.id) {
                            window.location.href = `/articles/${data.data.id}`;
                        } else if (data.data?.type === 'news' && data.data?.id) {
                            window.location.href = `/news/${data.data.id}`; // Assuming news route exists
                        }
                    },
                },
            });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from notification service');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <>{children}</>;
}
