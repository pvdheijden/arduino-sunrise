import os
import sys

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

from serial import *
from pubnub import *

publish_key = os.getenv('PN_PUBLISH_KEY')
subscribe_key = os.getenv('PN_SUBSCRIBE_KEY')

class PubnubProxy:
    def __init__(self, dev, channel):
        self.port = Serial(dev, 19200, bytesize=EIGHTBITS, parity=PARITY_NONE, stopbits=STOPBITS_ONE)

        self.pubnub = Pubnub(publish_key=publish_key, subscribe_key=subscribe_key)
        self.channel = channel

    def read(self):
        sensorVal = (self.port.readline()).strip().split(':')
        sensor = sensorVal[0]
        val = float(sensorVal[1])

        sensorVal = dict.fromkeys([sensor], val)
        return sensorVal

    def forward(self, sensorVal):
        def _callback(res):
            pass

        def _error(err):
            raise PubnubError(err)

        self.pubnub.publish(self.channel, sensorVal, _callback, _error);


    def run(self):
        while True:
            try:
                self.forward(self.read());
            except Exception as e:
                logging.warning(e)


if __name__ == '__main__':
    dev = sys.argv[1];
    channel = sys.argv[2];

    PubnubProxy(dev, channel).run();
