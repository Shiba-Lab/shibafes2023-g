#!/usr/bin/env python

import asyncio
from websockets import serve

clients = {}  # 接続中のクライアントを管理する辞書
next_id = 1  # 次に割り当てるID


async def echo(websocket, path):
    global next_id

    # 新しいクライアントにIDを割り当て、辞書に追加
    client_id = next_id
    next_id += 1
    clients[client_id] = websocket

    # クライアントにそのIDを送信
    print(f"Connected client: {websocket.remote_address}")  # クライアントのIPとポートを出力
    await websocket.send(f"Hello from server ID:{websocket.remote_address}")
    await websocket.send(f"Your ID is: {client_id}")

    try:
        async for message in websocket:
            # 特定のクライアントにメッセージを送信する指示がある場合
            if message.startswith("send_to:"):
                _, target_id, content = message.split(" ", 2)
                target_id = int(target_id)

                target_websocket = clients.get(target_id)
                if target_websocket:
                    await target_websocket.send(f"Message from ID {client_id}: {content}")
                else:
                    await websocket.send(f"Client ID {target_id} not found.")
            else:
                print(message)
                await websocket.send(message + " from server")
    finally:
        # クライアントが切断されたら辞書から削除
        del clients[client_id]


async def main():
    server = await serve(echo, "localhost", 8765)
    await server.wait_closed()

asyncio.run(main())
