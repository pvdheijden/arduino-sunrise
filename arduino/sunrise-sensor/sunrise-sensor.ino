const int led = 13;
const int sensor = 0;

const int minDuration = 100;
const int maxDuration = 1000;

// the setup routine runs once when you press reset:
void setup()
{
    Serial.begin(115200);
        
	// initialize the digital pin as an output.
	pinMode(led, OUTPUT);
}

// the loop routine runs over and over again forever:
void loop()
{
	int rate = analogRead(sensor);
	Serial.println(rate);

	rate = map(rate, 200, 800, minDuration, maxDuration);
	rate = constrain(rate, minDuration, maxDuration);
	
	digitalWrite(led, HIGH);
	delay(rate);
	digitalWrite(led, LOW);
	delay(rate);
}
