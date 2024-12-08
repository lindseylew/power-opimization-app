from pulp import LpProblem, LpVariable, LpMinimize, lpSum

def optimize_cost(data):
    demand = float(data['demand'])
    assets = data['assets']

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
