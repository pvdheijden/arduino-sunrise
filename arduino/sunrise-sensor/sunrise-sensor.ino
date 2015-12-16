const int led = 13;
static boolean ledState = LOW;

#define SENSOR_COUNT    6

#define LIGHT_SENSOR    0
#define TEMP_SENSOR     5

#define LIGHT_SENSOR_THRESHOLD    ((float)5.0)
#define TEMP_SENSOR_THRESHOLD     ((float)0.5)


float val[SENSOR_COUNT] = { 0, 0, 0, 0, 0, 0 };

void measurement(int sensor, float threshold)
{
  float newVal = analogRead(sensor);

  switch (sensor) {
    case LIGHT_SENSOR:
      break;

    case TEMP_SENSOR:
      newVal = ((newVal * (5.0 / 1024.0)) - 0.5) * 100.0;
      break;

    default:
      break;
  }

  if (abs(val[sensor] - newVal) >= threshold) {
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
  measurement(LIGHT_SENSOR, LIGHT_SENSOR_THRESHOLD);
  measurement(TEMP_SENSOR, TEMP_SENSOR_THRESHOLD);

  ledState = !ledState;
  digitalWrite(led, ledState);

  delay(1000);
}

