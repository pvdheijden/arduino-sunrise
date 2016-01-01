import os
import sys
import signal

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

from serial import *
from pubnub import *
from m2x.client import M2XClient
from datetime import datetime

pn_publish_key = os.getenv('PN_PUBLISH_KEY')
pn_subscribe_key = os.getenv('PN_SUBSCRIBE_KEY')
m2x_api_key = os.getenv('M2X_API_KEY')

class Proxy:
    def __init__(self, id, serial, channel):
        self.port = Serial(serial, 19200, bytesize=EIGHTBITS, parity=PARITY_NONE, stopbits=STOPBITS_ONE)

        self.pubnub = Pubnub(publish_key=pn_publish_key, subscribe_key=pn_subscribe_key)
        self.channel = channel

        self.m2x = M2XClient(key=m2x_api_key);
        self.device = self.m2x.device(id)

    def read(self):
        sensorVal = (self.port.readline()).strip().split(':')
        sensor = sensorVal[0]
        val = float(sensorVal[1])

        sensorVal = dict.fromkeys([sensor], val)
        return sensorVal

    def pubnubForward(self, sensorVal):
        def _callback(res):
            pass

        def _error(err):
            raise Exception('pubnub publish error: ' + err.message);

        self.pubnub.publish(self.channel, sensorVal, _callback, _error);

    def m2xStore(self, sensorVal):
        if "0" in sensorVal:
            self.device.stream('lr-light').add_value(sensorVal["0"], datetime.now())

        if "5" in sensorVal:
            self.device.stream('lr-temp').add_value(sensorVal["5"], datetime.now())

        return sensorVal


    def run(self):
        while True:
            try:
                self.pubnubForward(self.m2xStore(self.read()));
            except Exception as e:
                logging.warning(e)


if __name__ == '__main__':
    def sigterm_handler(_signo, _stack_frame):
        "When sysvinit sends the TERM signal, cleanup before exiting."
        print("[" + get_now() + "] received signal {}, exiting...".format(_signo))
        sys.exit(0)

    signal.signal(signal.SIGTERM, sigterm_handler)

    device = sys.argv[1]
    serial = sys.argv[2]
    channel = device

    Proxy(device, serial, channel).run();

