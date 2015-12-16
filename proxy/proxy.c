#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

#include "pubnub_sync.h"

//#define PN_PUBLISH_KEY "pub-c-85aee41c-476a-4324-b21d-b6f983e698bb"
//#define PN_SUBSCRIBE_KEY "sub-c-4fc31204-c4aa-11e3-9f73-02ee2ddab7fe"
//#define CHANNEL "bleekerstraatje-3"

int main(int argc, char* argv[]) {

    char* PN_PUBLISH_KEY = getenv("PN_PUBLISH_KEY");
    char* PN_SUBSCRIBE_KEY = getenv("PN_SUBSCRIBE_KEY");
    char* CHANNEL = getenv("CHANNEL");

    char* SERIAL_DEV = argv[1];

    enum pubnub_res pbresult;
    pubnub_t *ctx = pubnub_alloc();
    if (NULL == ctx) {
        fprintf(stderr, "pubnub context allocation error\n");
        exit(EXIT_FAILURE);
    }

    pubnub_init(ctx, PN_PUBLISH_KEY, PN_SUBSCRIBE_KEY);

    FILE* serial = fopen(SERIAL_DEV, "r");
    if (NULL == serial) {
        perror("serial port open error");
    } else {
        char inStr[64];
        char outStr[64];

        while(!feof(serial)) {
            if (NULL == fgets(inStr, 64, serial)) {
                perror("serial port read error");
            } else {
                char* port = strtok(inStr, ":");
                char* value = strtok(NULL, "\r\n");

                if (NULL != port && NULL != value) {
                    sprintf(outStr, "{ \"%s\": %s }", port, value);

                    pubnub_publish(ctx, CHANNEL, outStr);
                    pbresult = pubnub_await(ctx);
                    if (pbresult != PNR_OK) {
                        fprintf(stderr, "pubnub publish error [%d]\n", pbresult);
                    }
                }
            }
        }

        fclose(serial);
    }


    pubnub_free(ctx);

    exit(EXIT_SUCCESS);
}