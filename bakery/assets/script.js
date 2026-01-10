// ============================================
// Global State
// ============================================
let ingredientCounter = 1;
let currentBakeryItem = '';

// ============================================
// Handle Bakery Item Change
// ============================================
function handleBakeryItemChange() {
    const bakerySelect = document.getElementById('bakery-item');
    const selectedValue = bakerySelect.value;
    const addBakerySection = document.getElementById('add-bakery-section');
    const placeholderOption = document.getElementById('placeholder-option');

    // If "+ Add Bakery Item" is selected
    if (selectedValue === '__add_new__') {
        addBakerySection.style.display = 'block';
        // Reset to previous item or placeholder
        bakerySelect.value = currentBakeryItem || '';
        return;
    }

    // Hide placeholder option after first selection
    if (selectedValue && placeholderOption) {
        placeholderOption.style.display = 'none';
    }

    // If switching to a different item, clear ingredients and results
    if (currentBakeryItem && currentBakeryItem !== selectedValue && selectedValue !== '') {
        clearIngredientsAndResults();
    }

    // Update current bakery item
    if (selectedValue) {
        currentBakeryItem = selectedValue;
    }

    // Hide add bakery section
    addBakerySection.style.display = 'none';
}

// ============================================
// Save New Bakery Item
// ============================================
function saveBakeryItem() {
    const newItemName = document.getElementById('new-bakery-name').value.trim();

    if (!newItemName) {
        showNotification('Please enter a bakery item name!', 'warning');
        return;
    }

    // Create a value-friendly version (lowercase, hyphenated)
    const itemValue = newItemName.toLowerCase().replace(/\s+/g, '-');

    // Check if item already exists
    const bakerySelect = document.getElementById('bakery-item');
    const existingOptions = Array.from(bakerySelect.options);
    const exists = existingOptions.some(opt => opt.value === itemValue);

    if (exists) {
        showNotification('This item already exists!', 'warning');
        return;
    }

    // Add new option before the "+ Add Bakery Item" option
    const newOption = document.createElement('option');
    newOption.value = itemValue;
    newOption.textContent = newItemName;

    // Insert before the "+ Add Bakery Item" option
    const addNewOption = bakerySelect.querySelector('option[value="__add_new__"]');
    bakerySelect.insertBefore(newOption, addNewOption);

    // Select the newly added item
    bakerySelect.value = itemValue;
    currentBakeryItem = itemValue;

    // Hide placeholder
    const placeholderOption = document.getElementById('placeholder-option');
    if (placeholderOption) {
        placeholderOption.style.display = 'none';
    }

    // Clear and hide the add section
    document.getElementById('new-bakery-name').value = '';
    document.getElementById('add-bakery-section').style.display = 'none';

    showNotification(`"${newItemName}" added successfully!`, 'success');
}

// ============================================
// Clear Ingredients and Results
// ============================================
function clearIngredientsAndResults() {
    // Check if there are any ingredients to clear
    const container = document.getElementById('ingredients-container');
    const rows = Array.from(container.getElementsByClassName('ingredient-row'));

    let hasIngredients = false;

    // Check if any row has data
    rows.forEach(row => {
        const name = row.querySelector('.ingredient-name').value.trim();
        const rate = row.querySelector('.ingredient-rate').value;
        const quantity = row.querySelector('.ingredient-quantity').value;

        if (name || rate || quantity) {
            hasIngredients = true;
        }
    });

    // Remove all rows except the first
    rows.forEach((row, index) => {
        if (index > 0) {
            row.remove();
        }
    });

    // Clear the first row
    const firstRow = container.querySelector('.ingredient-row');
    if (firstRow) {
        firstRow.querySelector('.ingredient-name').value = '';
        firstRow.querySelector('.ingredient-rate').value = '';
        firstRow.querySelector('.ingredient-quantity').value = '';
    }

    // Reset counter
    ingredientCounter = 1;

    // Hide results
    const resultSection = document.getElementById('result-section');
    resultSection.style.display = 'none';

    // Reset packets
    document.getElementById('packets-produced').value = '1';

    // Only show notification if there were ingredients to clear
    if (hasIngredients) {
        showNotification('Ingredients cleared for new item', 'info');
    }
}

// ============================================
// Add New Ingredient Row
// ============================================
function addIngredient() {
    ingredientCounter++;

    const container = document.getElementById('ingredients-container');
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.setAttribute('data-row', ingredientCounter);

    newRow.innerHTML = `
        <div class="ingredient-grid">
            <div class="form-group">
                <label class="form-label-small">Ingredient Name</label>
                <input type="text" class="form-input ingredient-name" placeholder="e.g., Flour, Sugar, Butter">
            </div>

            <div class="form-group">
                <label class="form-label-small">Rate</label>
                <div class="input-with-unit">
                    <input type="number" class="form-input-inline ingredient-rate" placeholder="0.00" step="0.01" min="0" inputmode="decimal">
                    <select class="form-select-unit rate-unit">
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="ltr">ltr</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pieces</option>
                        <option value="doz">dozens</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label-small">Quantity</label>
                <div class="input-with-unit">
                    <input type="number" class="form-input-inline ingredient-quantity" placeholder="0" step="0.01" min="0" inputmode="decimal">
                    <select class="form-select-unit quantity-unit">
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="ltr">ltr</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pieces</option>
                        <option value="doz">dozens</option>
                    </select>
                </div>
            </div>

            <div class="form-group remove-btn-container">
                <button type="button" class="btn-remove" onclick="removeIngredient(this)" title="Remove ingredient">
                    <span>×</span>
                </button>
            </div>
        </div>
    `;

    container.appendChild(newRow);

    // Add animation
    setTimeout(() => {
        newRow.style.opacity = '1';
    }, 10);
}

// ============================================
// Remove Ingredient Row
// ============================================
function removeIngredient(button) {
    const container = document.getElementById('ingredients-container');
    const rows = container.getElementsByClassName('ingredient-row');

    // Prevent removing the last ingredient row
    if (rows.length <= 1) {
        showNotification('At least one ingredient is required!', 'warning');
        return;
    }

    const row = button.closest('.ingredient-row');
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';

    setTimeout(() => {
        row.remove();
    }, 300);
}

// ============================================
// Unit Conversion Helper
// ============================================
function convertToBaseUnit(value, unit) {
    // Convert to base units (kg for weight, ltr for volume, pieces for count)
    switch (unit) {
        case 'g':
            return value / 1000; // grams to kg
        case 'ml':
            return value / 1000; // ml to ltr
        case 'doz':
            return value * 12; // dozens to pieces
        case 'kg':
        case 'ltr':
        case 'pcs':
            return value; // already in base unit
        default:
            return value;
    }
}

// ============================================
// Calculate Total Cost
// ============================================
function calculateCost() {
    const bakeryItem = document.getElementById('bakery-item').value;
    const packetsProduced = parseFloat(document.getElementById('packets-produced').value) || 1;

    // Validate bakery item selection
    if (!bakeryItem) {
        showNotification('Please select a bakery item!', 'warning');
        return;
    }

    // Validate packets produced
    if (packetsProduced <= 0) {
        showNotification('Please enter a valid number of packets!', 'warning');
        return;
    }

    // Get all ingredient rows
    const ingredientRows = document.querySelectorAll('.ingredient-row');
    let totalCost = 0;
    let hasValidIngredient = false;

    ingredientRows.forEach((row, index) => {
        const name = row.querySelector('.ingredient-name').value.trim();
        const rate = parseFloat(row.querySelector('.ingredient-rate').value) || 0;
        const rateUnit = row.querySelector('.rate-unit').value;
        const quantity = parseFloat(row.querySelector('.ingredient-quantity').value) || 0;
        const quantityUnit = row.querySelector('.quantity-unit').value;

        // Calculate cost for this ingredient with unit conversion
        if (name && rate > 0 && quantity > 0) {
            hasValidIngredient = true;

            // Convert both to base units for accurate calculation
            const rateInBaseUnit = convertToBaseUnit(rate, rateUnit);
            const quantityInBaseUnit = convertToBaseUnit(quantity, quantityUnit);

            // Calculate cost: (rate per base unit) * (quantity in base units)
            const ingredientCost = rateInBaseUnit * quantityInBaseUnit;
            totalCost += ingredientCost;

            console.log(`Ingredient ${index + 1}: ${name}`);
            console.log(`  Rate: ${rate} ${rateUnit} (${rateInBaseUnit.toFixed(4)} base unit)`);
            console.log(`  Quantity: ${quantity} ${quantityUnit} (${quantityInBaseUnit.toFixed(4)} base unit)`);
            console.log(`  Cost: ₹${ingredientCost.toFixed(2)}`);
        }
    });

    // Validate that at least one valid ingredient exists
    if (!hasValidIngredient) {
        showNotification('Please add at least one valid ingredient with rate and quantity!', 'warning');
        return;
    }

    // Calculate costs
    const costPerPacket = totalCost / packetsProduced;
    const productionCost = totalCost;

    // Display results
    document.getElementById('total-cost').textContent = `₹${totalCost.toFixed(2)}`;
    document.getElementById('cost-per-packet').textContent = `₹${costPerPacket.toFixed(2)}`;
    document.getElementById('production-cost').textContent = `₹${productionCost.toFixed(2)}`;

    // Show result section with animation
    const resultSection = document.getElementById('result-section');
    resultSection.style.display = 'block';
    resultSection.style.opacity = '1';

    // Smooth scroll to results
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    // Log calculation summary
    console.log('=== Calculation Summary ===');
    console.log(`Bakery Item: ${bakeryItem}`);
    console.log(`Total Ingredient Cost: ₹${totalCost.toFixed(2)}`);
    console.log(`Number of Packets: ${packetsProduced}`);
    console.log(`Cost per Packet: ₹${costPerPacket.toFixed(2)}`);
    console.log(`Total Production Cost: ₹${productionCost.toFixed(2)}`);

    showNotification('Calculation completed successfully!', 'success');
}

// ============================================
// Show Notification (Visual Feedback)
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'hsl(145, 65%, 55%)' : type === 'warning' ? 'hsl(45, 95%, 60%)' : 'hsl(200, 85%, 60%)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================
// Initialize & Event Listeners
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('Bakery Cost Calculator initialized');

    // Add Enter key support for calculation
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.target.classList.contains('ingredient-name')) {
            calculateCost();
        }
    });

    // Auto-hide result section when inputs change
    const inputs = document.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            const resultSection = document.getElementById('result-section');
            if (resultSection.style.display === 'block') {
                resultSection.style.opacity = '0.5';
            }
        });
    });
});
