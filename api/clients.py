import socketio
import asyncio
import os


sio_client = socketio.AsyncClient()


@sio_client.event
async def connect():
    print("I'm connected")


@sio_client.event
async def disconnect():
    print("I'm disconnected")


async def main():
    await sio_client.connect(
        url=os.environ["LOCAL_HOST"], socketio_path="sockets"
    )
    await sio_client.disconnect()


asyncio.run(main())
