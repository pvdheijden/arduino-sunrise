const int led = 13;

const int lightSensor = 0;
static int lightVal = 0;


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
	int newLightVal = analogRead(lightSensor);
	if (abs(lightVal - newLightVal) > 50) {
	    lightVal = newLightVal;

	    Serial.print(lightSensor);
	    Serial.print(":");
	    Serial.println(lightVal);
	    Serial.flush();
	}

	digitalWrite(led, HIGH);
	delay(lightVal / 2);
	digitalWrite(led, LOW);
	delay(lightVal / 2);
}
