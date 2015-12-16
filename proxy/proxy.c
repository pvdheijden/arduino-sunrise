#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

#include "pubnub_sync.h"

//#define PN_PUBLISH_KEY "pub-c-85aee41c-476a-4324-b21d-b6f983e698bb"
//#define PN_SUBSCRIBE_KEY "sub-c-4fc31204-c4aa-11e3-9f73-02ee2ddab7fe"
//#define CHANNEL "bleekerstraatje-3"

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
                int port = atoi(strtok(in_str, ":"));
                int value = atoi(strtok(NULL, "\r\n"));

                if (port == 5) {
                    value = ((value * (5.0 / 1024.0)) - 0.5) * 100;
                }

                sprintf(out_str, "{ \"%d\": %d }", port, value);
                fprintf(stderr, "%s", out_str);

                pubnub_publish(ctx, channel, out_str);
                pbresult = pubnub_await(ctx);
                if (pbresult != PNR_OK) {
                    fprintf(stderr, "pubnub publish error [%d]\n", pbresult);
                }

                fprintf(stderr, "\t--> result: %d\n", pbresult);
            }
        }

        fclose(serial);
    }


    pubnub_free(ctx);

    exit(EXIT_SUCCESS);
}