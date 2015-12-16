#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

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

    FILE* serial = fopen(serial_dev, "r");
    if (NULL == serial) {
        perror("serial port open error");
    } else {
        char in_str[64];
        char out_str[64];

        while(!feof(serial)) {
            if (NULL == fgets(in_str, 64, serial)) {
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
        perror("serial port connection");

        fclose(serial);
    }


    pubnub_free(ctx);

    exit(EXIT_SUCCESS);
}
