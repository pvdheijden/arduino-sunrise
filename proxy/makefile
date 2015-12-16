SOURCEFILES = ./pubnub/core/pubnub_coreapi.c ./pubnub/core/pubnub_ccore.c ./pubnub/core/pubnub_netcore.c  ./pubnub/openssl/pbpal_openssl.c ./pubnub/openssl/pbpal_resolv_and_connect_openssl.c ./pubnub/core/pubnub_alloc_std.c ./pubnub/core/pubnub_assert_std.c ./pubnub/core/pubnub_generate_uuid.c ./pubnub/core/pubnub_blocking_io.c ./pubnub/core/pubnub_json_parse.c ./pubnub/core/pubnub_helper.c ./pubnub/openssl/pubnub_version_openssl.c ./pubnub/posix/pubnub_generate_uuid_posix.c ./pubnub/openssl/pbpal_openssl_blocking_io.c

OS := $(shell uname)
ifeq ($(OS),Darwin)
SOURCEFILES += ./pubnub/posix/monotonic_clock_get_time_darwin.c
else
SOURCEFILES += ./pubnub/posix/monotonic_clock_get_time_posix.c
endif

CFLAGS =-g -std=gnu99 -D VERBOSE_WARN -I ./pubnub/core -I . -I ./pubnub/posix/fntest -I ./pubnub/core/fntest -I ./pubnub/openssl -Wall
# -g enables debugging, remove to get a smaller executable

all: proxy

proxy: proxy.c $(SOURCEFILES) ./pubnub/core/pubnub_ntf_sync.c
	$(CC) -o $@ $(CFLAGS) proxy.c ./pubnub/core/pubnub_ntf_sync.c $(SOURCEFILES) -lssl -lcrypto

clean:
	rm pubnub_sync_sample
