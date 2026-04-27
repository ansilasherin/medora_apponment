# Video/Audio Call Feature Documentation

## Overview
The appointment booking application now includes real-time video and audio calling functionality, allowing doctors and patients to conduct virtual consultations.

## Features

### 🎥 Video Calling
- Real-time video communication between doctors and patients
- WebRTC-based peer-to-peer connection
- High-quality video streaming
- Screen sharing capabilities

### 🎤 Audio Calling
- Voice-only consultations
- High-quality audio streaming
- Perfect for follow-up calls or quick consultations

### 💬 Real-time Chat
- Text messaging during calls
- Timestamped messages
- Integrated with call interface

### 🔐 Security & Authentication
- JWT-based authentication for call access
- Appointment-based authorization
- Secure WebRTC connections

## API Endpoints

### Start a Call
```http
POST /api/calls/start
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "appointmentId": "appointment_id_here",
  "callType": "video" // or "audio"
}
```

### Get Call Status
```http
GET /api/calls/status/:appointmentId
Authorization: Bearer <jwt_token>
```

### End a Call
```http
POST /api/calls/end/:appointmentId
Authorization: Bearer <jwt_token>
```

### Get Call History
```http
GET /api/calls/history
Authorization: Bearer <jwt_token>
```

## Socket.io Events

### Client to Server Events

#### Join Call
```javascript
socket.emit('join-call', {
  appointmentId: 'appointment_id',
  callType: 'video' // or 'audio'
});
```

#### WebRTC Signaling
```javascript
// Send offer
socket.emit('offer', {
  targetUserId: 'other_user_id',
  offer: offerObject,
  appointmentId: 'appointment_id'
});

// Send answer
socket.emit('answer', {
  targetUserId: 'other_user_id',
  answer: answerObject,
  appointmentId: 'appointment_id'
});

// Send ICE candidate
socket.emit('ice-candidate', {
  targetUserId: 'other_user_id',
  candidate: candidateObject,
  appointmentId: 'appointment_id'
});
```

#### Call Controls
```javascript
// Toggle mute
socket.emit('toggle-mute', {
  appointmentId: 'appointment_id',
  muted: true/false
});

// Toggle video
socket.emit('toggle-video', {
  appointmentId: 'appointment_id',
  videoOff: true/false
});

// End call
socket.emit('end-call', {
  appointmentId: 'appointment_id'
});
```

#### Chat Messages
```javascript
socket.emit('send-message', {
  appointmentId: 'appointment_id',
  message: 'Hello, how are you?'
});
```

### Server to Client Events

#### Call Events
```javascript
// When successfully joined call
socket.on('call-joined', (data) => {
  console.log('Call data:', data.callData);
});

// When participant joins
socket.on('participant-joined', (data) => {
  console.log('New participant:', data.participant);
});

// When participant leaves
socket.on('participant-left', (data) => {
  console.log('Participant left:', data.userId);
});

// When call ends
socket.on('call-ended', (data) => {
  console.log('Call ended for appointment:', data.appointmentId);
});
```

#### WebRTC Signaling
```javascript
// Receive offer
socket.on('offer', async (data) => {
  // Handle WebRTC offer
});

// Receive answer
socket.on('answer', async (data) => {
  // Handle WebRTC answer
});

// Receive ICE candidate
socket.on('ice-candidate', async (data) => {
  // Handle ICE candidate
});
```

#### Call Controls
```javascript
// Participant muted/unmuted
socket.on('participant-muted', (data) => {
  console.log('User muted:', data.userId, data.muted);
});

// Participant video on/off
socket.on('participant-video-off', (data) => {
  console.log('User video off:', data.userId, data.videoOff);
});
```

#### Chat
```javascript
// New message received
socket.on('new-message', (data) => {
  console.log('New message from:', data.from, data.message);
});
```

## Testing the Video Call Feature

### 1. Start the Server
```bash
npm start
```

### 2. Open the Test Client
Navigate to: `http://localhost:5000/video-call.html`

### 3. Authenticate
- Get a JWT token from your login API
- Enter the token in the authentication section
- Click "Authenticate"

### 4. Start a Call
- Enter a valid appointment ID
- Select call type (video/audio)
- Click "Start Call"

### 5. Test Features
- Video/audio streaming
- Mute/unmute controls
- Video on/off controls
- Text chat functionality

## Technical Implementation

### Backend Components
- **Socket.io**: Real-time bidirectional communication
- **WebRTC**: Peer-to-peer video/audio streaming
- **JWT Authentication**: Secure call access
- **Appointment Integration**: Call authorization based on appointments

### Frontend Components
- **WebRTC API**: Browser-based media streaming
- **Socket.io Client**: Real-time event handling
- **HTML5 Video**: Video display and controls
- **MediaDevices API**: Camera/microphone access

### Security Features
- JWT token validation for socket connections
- Appointment-based call authorization
- User role verification (doctor/patient)
- Secure WebRTC connections

## Browser Requirements

### Supported Browsers
- Chrome 56+
- Firefox 44+
- Safari 11+
- Edge 79+

### Required Permissions
- Camera access (for video calls)
- Microphone access (for audio calls)
- WebRTC support
- WebSocket support

## Network Requirements

### Recommended Setup
- Stable internet connection (minimum 1 Mbps upload/download)
- Low latency (< 100ms) for best experience
- STUN/TURN servers for NAT traversal

### Firewall Configuration
- Allow WebSocket connections (port 5000)
- Allow STUN/TURN server access
- Allow WebRTC peer connections

## Troubleshooting

### Common Issues

#### "Camera/Microphone not accessible"
- Check browser permissions
- Ensure HTTPS in production
- Verify media devices are available

#### "Connection failed"
- Check internet connection
- Verify JWT token validity
- Check appointment authorization

#### "Poor video quality"
- Check bandwidth
- Reduce video resolution
- Close other applications using camera

#### "Audio echo"
- Use headphones
- Check microphone settings
- Adjust audio levels

## Future Enhancements

### Planned Features
- Screen sharing
- Call recording
- Multiple participants
- Call waiting queue
- Video call scheduling
- Call analytics and reporting

### Performance Optimizations
- Video compression
- Bandwidth adaptation
- Mobile optimization
- Cross-platform support

## Support

For technical support or questions about the video call feature, please refer to the main application documentation or contact the development team.