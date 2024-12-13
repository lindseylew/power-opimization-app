from dotenv import load_dotenv
from pulp import LpProblem, LpVariable, LpMinimize, lpSum
import requests
import os


load_dotenv()

def optimize_cost(data):
    if 'demand' not in data or 'assets' not in data:
        return {'status': 'Failure', 'message': 'Invalid input data. Missing demand or assets'}
    
    try:
        demand = float(data['demand'])
        assets = data['assets']
    except ValueError:
        return {'status': 'Failure', 'message': 'Invalid demand or assets format'}
    
    if not isinstance(assets, list) or not all(isinstance(asset, dict) for asset in assets):
        return {'status': 'Failure', 'message': 'Assets should be in a list of dictionaries'}

    problem = LpProblem("Cost_Minimization", LpMinimize)

    # Create the allocation variables
    allocations = LpVariable.dicts(
        'Allocation',
        [asset['name'] for asset in assets],
        lowBound=0, 
        cat='Continuous'
    )

    # Objective function: minimize the total cost
    problem += lpSum(
        allocations[asset['name']] * (float(asset['cost_per_mwh']) if asset['cost_per_mwh'] else 0)
        for asset in assets
    )

    # Constraint: total allocation must match demand
    problem += lpSum(allocations[asset['name']] for asset in assets) == demand

    # Constraints: allocation must not exceed max capacity for each asset
    for asset in assets:
        max_capacity = float(asset['max_capacity']) if asset.get('max_capacity') else 0
        problem += allocations[asset['name']] <= max_capacity

    # Solve the problem
    problem.solve()

    # Check if the solution is optimal
    if problem.status != 1:
        return {'status': 'Failure', 'message': 'No optimal solution found.'}

    # Calculate the total cost and allocations
    total_cost = sum(
        allocations[asset['name']].varValue * (float(asset['cost_per_mwh']) if asset['cost_per_mwh'] else 0)
        for asset in assets
    )

    # Return the results
    return {
        'status': 'Success',
        'total_cost': total_cost,
        'allocations': {asset['name']: allocations[asset['name']].varValue for asset in assets}
    }


# Fetch weather data
def getWeatherForecast(city_name):

    api_key = os.getenv("OPENWEATHERMAP_API_KEY")
    print(f"API Key: {api_key}")

    if not api_key:
        print("Error: Api key not found")
        return None

    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={api_key}&units=imperial"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        forecast_data = []
        for forecast in data['list']:
            forecast_info = {
                "date_time": forecast["dt_txt"],
                "temperature": forecast["main"]["temp"],
                "humidity": forecast["main"]["humidity"],
                "weather": forecast["weather"][0]["description"],
            }
            forecast_data.append(forecast_info)

        return forecast_data

    except requests.exceptions.RequestException as e:
        print(f"Error in fetching weather data: {e}")
        return None
            