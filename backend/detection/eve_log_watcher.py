import asyncio
import os
import logging
import aiofiles
from backend.detection.eve_parser import EveParser
from backend.detection.alert_manager import AlertManager

logger = logging.getLogger(__name__)

class EVELogWatcher:
    def __init__(self, file_path: str, alert_manager: AlertManager, batch_size: int = 100):
        self.file_path = file_path
        self.alert_manager = alert_manager
        self.batch_size = batch_size
        self.queue = asyncio.Queue()
        self._running = False
        self._tail_task = None
        self._worker_task = None

    async def _tail_file(self):
        directory = os.path.dirname(self.file_path)
        os.makedirs(directory, exist_ok=True)
        
        # Wait for file to exist
        while not os.path.exists(self.file_path) and self._running:
            await asyncio.sleep(1)
            
        if not self._running:
            return

        async with aiofiles.open(self.file_path, "r") as f:
            await f.seek(0, os.SEEK_END)
            while self._running:
                line = await f.readline()
                if not line:
                    await asyncio.sleep(0.1)
                    continue
                    
                parsed = EveParser.parse_line(line)
                if parsed:
                    alert_data = EveParser.extract_alert_data(parsed)
                    if alert_data:
                        await self.queue.put(alert_data)

    async def _process_queue(self):
        while self._running:
            batch = []
            try:
                # Get first item (blocks until available)
                item = await self.queue.get()
                batch.append(item)
                
                # Try to fill the rest of the batch without blocking
                while len(batch) < self.batch_size and not self.queue.empty():
                    batch.append(self.queue.get_nowait())
                    
                # Process the batch concurrently but limited by semaphore/batch
                tasks = [self.alert_manager.process_parsed_alert(alert) for alert in batch]
                await asyncio.gather(*tasks, return_exceptions=True)
                
                for _ in batch:
                    self.queue.task_done()
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error processing alert batch: {e}")

    def start(self):
        self._running = True
        loop = asyncio.get_event_loop()
        self._tail_task = loop.create_task(self._tail_file())
        self._worker_task = loop.create_task(self._process_queue())
        logger.info(f"Started asynchronous EVE log watcher on {self.file_path}")

    def stop(self):
        self._running = False
        if self._tail_task:
            self._tail_task.cancel()
        if self._worker_task:
            self._worker_task.cancel()

