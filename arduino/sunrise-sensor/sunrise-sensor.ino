const int led = 13;
static boolean ledState = LOW;

#define SENSOR_COUNT    2
#define LIGHT_SENSOR    0
#define TEMP_SENSOR     1

int val[SENSOR_COUNT] = { 0, 0 };

void measurement(int sensor, int threshold)
{
	int newVal = analogRead(sensor);
	if (abs(val[sensor] - newVal) > threshold) {
	    val[sensor] = newVal;

	    Serial.print(sensor);
	    Serial.print(":");
	    Serial.println(val[sensor]);
	    Serial.flush();
	}
}

// the setup routine runs once when you press reset:
void setup()
{
    Serial.begin(9600);
        
	// initialize the digital pin as an output.
	pinMode(led, OUTPUT);
}

// the loop routine runs over and over again forever:
void loop()
{
    measurement(LIGHT_SENSOR, 5);
    measurement(TEMP_SENSOR, 3);

    ledState = !ledState;
	digitalWrite(led, ledState);
	delay(100);
}
