from pulp import LpProblem, LpVariable, LpMinimize, lpSum

def optimize_cost(data):
    demand = float(data['demand'])
    assets = data['assets']

    problem = LpProblem("Cost_Minimization", LpMinimize)


    allocations = LpVariable.dicts(
        'Allocation',
        [asset['name'] for asset in assets],
        lowBound=0, 
        cat='Continuous'
    )

    problem += lpSum(allocations[asset['name']] * float(asset['cost_per_mwh']) for asset in assets)

    problem += lpSum(allocations[asset['name']] for asset in assets) == demand

    for asset in assets:
        problem += allocations[asset['name']] <= float(asset['max_capacity'])


    problem.solve()

    if problem.status != 1:
        return {'status': 'Failure', 'message': 'No optimal solution found.'}

    total_cost = sum(allocations[asset['name']].varValue * float(asset['cost_per_mwh']) for asset in assets)

    return {
        'status': 'Success',
        'total_cost': total_cost,
        'allocations': {asset['name']: allocations[asset['name']].varValue for asset in assets}
    }
