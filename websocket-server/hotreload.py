"""
    File Name   : hotreload.py
    Created     : on 16:19 at Sep 17, 2023
    Description : src 直下のファイルを監視して、ホットリロードできるようにするスクリプト

    Copyright 2023 Shogo Kitada All Rights Reserved.
        contact@shogo0x2e.com (Twitter, GitHub: @shogo0x2e)

    I would be happy to notify me if you use part of my code.
"""


import subprocess
import time
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

ENTRY_SCRIPT = "/root/src/main.py"

class FileChangeEventHandler(FileSystemEventHandler):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.process = subprocess.Popen(['python', self.filename])
    
    def on_modified(self, event):
        print(f"{self.filename} has been changed. Restarting process...")
        
        if "__pycache__" in event.src_path:
            return
        
        self.on_terminate()
        
        self.process = subprocess.Popen(['python', self.filename])
        
    def on_terminate(self):
        self.process.terminate()
        self.process.wait()

if __name__ == "__main__":

    event_handler = FileChangeEventHandler(ENTRY_SCRIPT)
    observer = Observer()
    observer.schedule(event_handler, ".", recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        event_handler.on_terminate()
        observer.stop()
        observer.join()
