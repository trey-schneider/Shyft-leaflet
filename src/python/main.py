import requests
import datetime
from datetime import timedelta
import json
import polyline
from typing import List, Dict, Optional, Tuple
import requests
import math
import os
from dotenv import load_dotenv

load_dotenv()

PUBLIC_IP = os.getenv("PUBLIC_IP")

class Segment:
    """_summary_
    """
    def __init__(self, points: List[Tuple[float, float]], valid_time: datetime):
        self.points = points
        self.valid_time = valid_time
        self.midpoint = self._calculate_mid_point()
        self.weather_impact = {}
        self.get_temp()

    def add_weather(self, parameter_name: str, value: float):
        self.weather_impact[parameter_name] = value

    def encode_route(self):
        encoded_line = polyline.encode(self.points)
        return encoded_line

    def _calculate_mid_point(self):
        if len(self.points) > 1:
            middle_index = len(self.points) // 2
            midpoint = self.points[middle_index]
        else:
            midpoint = self.points[0]
        return midpoint
    
    def get_temp(self):
        lat = self.midpoint[0]
        long = self.midpoint[1]
        hours = self._get_hours()
        r = requests.get(f'http://{PUBLIC_IP}:8007/WCS?SERVICE=WCS&VERSION=2.0.0&REQUEST=GetCoverage&CoverageId=KGFS_Latest_AGL&RANGESUBSET=Temperature&SUBSET=f("PT{hours}H")&SUBSET=z(2.0)&SUBSET=long({long})&SUBSET=lat({lat})&FORMAT=JSON')
        if r.status_code == 200:
            k = r.json()['coverageData'][0]['values'][0][0]
            temp = self._k_to_f(k)
            self.weather_impact['temp'] = temp
        r = requests.get(f'http://{PUBLIC_IP}:8007/WCS?SERVICE=WCS&VERSION=2.0.0&REQUEST=GetCoverage&CoverageId=KGFS_Latest_AGL&RANGESUBSET=Wind&SUBSET=f("PT{hours}H")&SUBSET=z(10.0)&SUBSET=long({long})&SUBSET=lat({lat})&FORMAT=JSON')
        if r.status_code == 200:
            vector = r.json()['coverageData'][0]['values'][0][0]
            wind_speed = self._get_wind_speed(vector["u"], vector["v"])
            self.weather_impact['wind_speed'] = wind_speed
        print(f'http://{PUBLIC_IP}:8007/WCS?SERVICE=WCS&VERSION=2.0.0&REQUEST=GetCoverage&CoverageId=KGFS_Latest_Ground&RANGESUBSET=TotalPrecipitation&SUBSET=f("PT{hours}H")&SUBSET=long({long})&SUBSET=lat({lat})&FORMAT=JSON')
        r = requests.get(f'http://{PUBLIC_IP}:8007/WCS?SERVICE=WCS&VERSION=2.0.0&REQUEST=GetCoverage&CoverageId=KGFS_Latest_Ground&RANGESUBSET=TotalPrecipitation&SUBSET=f("PT{hours}H")&SUBSET=long({long})&SUBSET=lat({lat})&FORMAT=JSON')
        if r.status_code == 200:
            tp = r.json()['coverageData'][0]['values'][0][0]
            rain = self._kg_per_m2_to_inches(tp)
            self.weather_impact['total_precipitation'] = rain

    def _k_to_f(self, k):
        return round((k - 273.15) * 1.8 + 32)
    
    def _get_wind_speed(self, u, v):
        ws = math.sqrt(u**2+v**2)
        ws = ws * 2.237
        return round(ws)
    
    def _kg_per_m2_to_inches(self, kg_per_m2):
        inches = kg_per_m2 * 0.0393701
        rounded_inches = round(inches, 2)
        return rounded_inches
    
    def _get_hours(self):
        td = self.valid_time - datetime.datetime.now(datetime.UTC)
        self.valid_time = self.valid_time.strftime('%Y-%m-%d %I:%M %p')
        return td.seconds//3600

class Route:
    """_summary_
    """
    def __init__(self, start_time: datetime, json_data: Dict, max_duration_minutes: int = 30 ):
        """
        Constructs a Route object from a JSON object returned by the Google Maps Route API.

        Args:
        - json_data: A dictionary representing the JSON response from the API.
        """
        self._data = json_data
        self.start_time = start_time
        self.max_duration_minutes = max_duration_minutes
        self.segments: List[Optional[Segment]] = []

    @property
    def travel_time(self):
        """
        Returns the travel time for the route as a datetime.timedelta object.
        """
        seconds = self._data["routes"][0]["legs"][0]["duration"]["value"]
        return timedelta(seconds=seconds)


    @property
    def steps(self):
        """
        Returns a list of dictionaries representing the individual steps of the route.
        Each dictionary contains information about a single step of the route.
        """
        return self._data["routes"][0]["legs"][0]["steps"]

    def convert_steps_to_points(self):
        """
        Convert google maps directions into a list of segments based on max duration
        """
        points = []
        segment_duration = 0
        total_duration = 0
        for step in self.steps:
            step_points = polyline.decode(step["polyline"]["points"])
            increment = len(step_points) / step["duration"]["value"]
            for point in step_points:
                points.append(point)
                segment_duration += increment
                total_duration += increment
                if segment_duration > 60 * self.max_duration_minutes:
                    self._add_segment(points, total_duration)
                    points = []
                    segment_duration = 0
            if step == self.steps[-1]:
                self._add_segment(points, total_duration)

    def _add_segment(self, points: List[Tuple[float, float]], total_duration):
        timestamp = self._generate_timestamp(total_duration)
        self.segments.append(Segment(points, timestamp))

    def _generate_timestamp(self, total_duration):
        max_duration_seconds = self.max_duration_minutes * 60
        rounded_seconds = round(total_duration / max_duration_seconds) * max_duration_seconds
        timestamp = self.start_time + timedelta(seconds=rounded_seconds)
        return timestamp
    

def get_route(start_loc, end_loc):

    # Define your Google Route API key
    api_key = os.getenv("API")

    # Construct the API URL for the route request
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={start_loc}&destination={end_loc}&key={api_key}&format=geojson"

    # Send the route request to the Google Route API
    response = requests.get(url)

    # Parse the JSON response from the API
    data = json.loads(response.text)

    # Create a new Route object from the JSON data
    route = Route(datetime.datetime.now(datetime.UTC), data)
    
    route.convert_steps_to_points()

    return route.segments

# get_route('Omaha, NE', 'Chicago, IL')

def default_handler(obj):
    return {'validTime': obj.valid_time, 'midpoint': obj.midpoint, 'weatherImpact': obj.weather_impact}

