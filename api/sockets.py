import socketio

sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[]
)

sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    socketio_path='sockets'
)


@sio_server.event
async def connect(sid, environ, auth):
    print(f'{sid}: connected')
    await sio_server.save_session(sid, {
        'username': 'Guest',
        'photo': ''})
    session = await sio_server.get_session(sid)
    await sio_server.emit('join', {
        'sid': sid,
        'username': session['username'],
        'photo': session['photo']
    })


@sio_server.event
async def chat(sid, message):
    session = await sio_server.get_session(sid)
    await sio_server.emit('chat', {
        'sid': sid,
        'message': message,
        'username': session['username'],
        'photo': session['photo']
    })


@sio_server.event
async def disconnect(sid):
    print(f'{sid}: disconnected')


@sio_server.event
async def namepass(sid, username):
    await sio_server.save_session(sid, {
        'username': username.get('username'),
        'photo': username.get('photo')
    })
    await sio_server.emit('namepass', {
        'username': username.get('name'),
        'photo': username.get('photo')})


# @sio_server.event
# async def photopass(sid, photo):
#     await sio_server.save_session(sid, {
#         'username': user[8],
#         'photo': user['photo']
#     })
