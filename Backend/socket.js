const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`[Socket] Join: userType=${userType}, userId=${userId}, socketId=${socket.id}`);

            if (!userId) {
                console.warn('[Socket] Join ignored: empty userId');
                return;
            }

            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }
            } catch (err) {
                console.error('[Socket] Error updating socketId in DB:', err.message);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!userId || !location || location.ltd === undefined || location.lng === undefined) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                });
            } catch (err) {
                console.error('[Socket] Error updating captain location:', err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(`[Socket] Emitting '${messageObject.event}' to target socket ${socketId}`);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('[Socket] Socket.io not initialized.');
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };