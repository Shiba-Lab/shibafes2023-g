#!/usr/bin/env python

import asyncio
from websockets import serve
import uuid
import json

clients = {}  # 接続中のクライアントを管理する辞書
admins = []  # 管理者を管理するリスト
screens = []  # screenを管理するリスト
color_list = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown']

async def echo(websocket, path):
    print(f"Connected client: {websocket.remote_address}")
    # 再接続かどうか問い合わせる
    await websocket.send(json.dumps({'type': 'check_reconnect'}))

    try:
        async for message in websocket:
            print("message:", message)
            # messageをparse
            data = json.loads(message)
            
            # messageによって分岐
            if data['type'] == 'setup':
                if data.get('id') == None:
                    # idがない場合は新規接続なので、辞書に追加
                    client_id = str(uuid.uuid4())
                    clients[client_id] = {
                        'websocket': websocket, 'role': data['role']}
                    result = {'type': 'setup',
                              'id': client_id, 'role': data['role']}
                    await websocket.send(json.dumps(result))
                else:
                    # idがある場合は再接続なので、辞書を更新
                    clients[data['id']]['websocket'] = websocket
            elif data['type'] == 'reconnect':
                # 再接続の場合は辞書を更新
                if data['id'] in clients:
                    clients[data['id']]['websocket'] = websocket
                else:
                    clients[data['id']] = {
                        **data,
                        'websocket': websocket}
            elif data['type'] == 'init_new':
                # 新規接続の場合は辞書を更新
                clients[data['id']] = {
                    **data,
                    'colorId': len(clients) % len(color_list),
                    'clientNum': len(clients),
                    'color': color_list[len(clients) % len(color_list)],
                    'websocket': websocket
                    }
                await websocket.send(json.dumps(
                    {
                        'type': 'init_new',
                        'color': clients[data['id']]['color'],
                        'clientNum': len(clients)
                    })
                )
            else:
                print(data)
            # 特定のクライアントにメッセージを送信する指示がある場合
            # if message.startswith("send_to:"):
            #     _, target_id, content = message.split(" ", 2)
            #     target_id = int(target_id)

            #     target_websocket = clients.get(target_id)['websocket']
            #     if target_websocket:
            #         await target_websocket.send(f"Message from ID {client_id}: {content}")
            #     else:
            #         await websocket.send(f"Client ID {target_id} not found.")
            # else:
            #     print(message)
            #     await websocket.send(message + " from server")
    finally:
        pass
        # クライアントが切断されたら辞書から削除
        # del clients[client_id]


async def main():
    server = await serve(echo, "localhost", 8765)
    await server.wait_closed()

asyncio.run(main())
