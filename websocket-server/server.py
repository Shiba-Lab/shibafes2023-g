#!/usr/bin/env python

import asyncio
from websockets.server import serve

async def echo(websocket):
  async for message in websocket:
    print(message)
    await websocket.send(message + " from server")

async def main():
  async with serve(echo, "localhost", 8765):
    await asyncio.Future()  # run forever

asyncio.run(main())