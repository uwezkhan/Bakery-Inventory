# Bakery Cost Calculator (Actual Cost - No Profit)

print("=== Bakery Actual Cost Calculator ===\n")

# Ingredients input
flour_kg = float(input("Enter flour quantity (kg): "))
flour_rate = float(input("Enter flour rate per kg (₹): "))

dalda_kg = float(input("\nEnter dalda quantity (kg): "))
dalda_rate = float(input("Enter dalda rate per kg (₹): "))

oil_ltr = float(input("\nEnter oil quantity (litres): "))
oil_rate = float(input("Enter oil rate per litre (₹): "))

water_cost = float(input("\nEnter water cost (₹): "))

labour_cost = float(input("\nEnter labour charges (₹): "))

addons_cost = float(input("\nEnter other supplements/add-ons cost (₹): "))

total_packs = int(input("\nEnter total number of packs produced: "))

# Calculations
flour_cost = flour_kg * flour_rate
dalda_cost = dalda_kg * dalda_rate
oil_cost = oil_ltr * oil_rate

total_cost = (
    flour_cost +
    dalda_cost +
    oil_cost +
    water_cost +
    labour_cost +
    addons_cost
)

cost_per_pack = total_cost / total_packs

# Output
print("\n=== Cost Breakdown ===")
print(f"Flour cost: ₹{flour_cost:.2f}")
print(f"Dalda cost: ₹{dalda_cost:.2f}")
print(f"Oil cost: ₹{oil_cost:.2f}")
print(f"Water cost: ₹{water_cost:.2f}")
print(f"Labour cost: ₹{labour_cost:.2f}")
print(f"Add-ons cost: ₹{addons_cost:.2f}")

print("\n--- Final Result ---")
print(f"Total production cost: ₹{total_cost:.2f}")
print(f"Actual cost per pack (no profit): ₹{cost_per_pack:.2f}")

input("\nPress Enter to exit...")
