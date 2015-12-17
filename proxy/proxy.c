#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>

#include "pubnub_sync.h"

int main(int argc, char* argv[]) {

    char* publish_key = getenv("PN_PUBLISH_KEY");
    char* subscribe_key = getenv("PN_SUBSCRIBE_KEY");
    char* channel = getenv("PN_CHANNEL");

    char* serial_dev = argv[1];

    enum pubnub_res pbresult;
    pubnub_t *ctx = pubnub_alloc();
    if (NULL == ctx) {
        fprintf(stderr, "pubnub context allocation error\n");
        exit(EXIT_FAILURE);
    }

    pubnub_init(ctx, publish_key, subscribe_key);

    int serial = open(serial_dev, O_RDONLY);
    if (serial == -1) {
        perror("serial port open error");
    } else {

        struct termios term, term_save;

        tcgetattr(serial, &term_save);
        term = term_save;

        /*
        115200 Baud, 8N1
        */
        cfsetospeed(&term,B115200);
        cfsetispeed(&term,B115200);
        term.c_cflag &= ~CSIZE; term.c_cflag |= CS8;
        term.c_cflag &= ~PARENB;
        term.c_cflag &= ~CSTOPB;

        term.c_cflag |= CLOCAL;
        term.c_cflag |= CREAD;

        term.c_iflag |= IXON;
        term.c_iflag |= IXOFF;
        term.c_iflag |= ICRNL;

        term.c_lflag &= ~ ECHO;
        term.c_cc[VMIN] = 4;
        term.c_cc[VTIME] = 0;

        if (tcsetattr(serial, TCSANOW, &term) < 0) {
            perror("serial set attribute error");
        };

        sleep(2);

        char in_str[64];
        char out_str[64];

        while(true) {
            if (read(serial, in_str, 64) < 0) {
                perror("serial port read error");
            } else {
                fprintf(stderr, "IN: %s\n", in_str);

                char* port = strtok(in_str, ":");
                char* value = strtok(NULL, "\r\n");

                if (port != NULL && value != NULL) {
                    sprintf(out_str, "{ \"%s\": %s }", port, value);

                    fprintf(stderr, "OUT: %s: %s", channel, out_str);
                    pubnub_publish(ctx, channel, out_str);
                    pbresult = pubnub_await(ctx);
                    if (pbresult != PNR_OK) {
                        fprintf(stderr, "pubnub publish error [%d]\n", pbresult);
                    }

                    fprintf(stderr, "\t--> result: %d\n", pbresult);
                }
            }
        }

        tcsetattr(serial, TCSANOW, &term_save);
        close(serial);
    }

    pubnub_free(ctx);

    exit(EXIT_SUCCESS);
}
