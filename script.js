const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const listEl = document.getElementById('transaction-list');
const form = document.getElementById('money-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

// Grab my saved data from local storage so I don't lose progress on refresh
let transactions = JSON.parse(localStorage.getItem('sewa_data')) || [];

function updateSummary() {
    // Map the values and turn expenses into negative numbers for the math
    const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
    
    // Total balance calculation
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    // Calculate only the plus side (income)
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => (acc += t.amount), 0)
        .toFixed(2);

    // Calculate only the minus side (expenses)
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => (acc += t.amount), 0)
        .toFixed(2);

    // Update the UI text with the Rupee symbol
    balanceEl.innerText = `₹${total}`;
    incomeEl.innerText = `₹${income}`;
    expenseEl.innerText = `₹${expense}`;
}

function renderList() {
    // Clear out the current list before rebuilding it from the array
    listEl.innerHTML = '';

    if (transactions.length === 0) {
        listEl.innerHTML = '<li class="empty-msg">No transactions yet. Start saving!</li>';
        return;
    }

    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        
        // Add classes for styling (borders depend on if it's income or expense)
        li.classList.add('transaction-item');
        li.classList.add(transaction.type === 'income' ? 'income-border' : 'expense-border');

        const sign = transaction.type === 'income' ? '+' : '-';

        // Building the list item HTML structure
        li.innerHTML = `
            <div class="item-info">
                <strong>${transaction.description}</strong>
                <span class="item-date">${transaction.date}</span>
            </div>
            <div>
                <span class="item-amount">${sign}₹${transaction.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
            </div>
        `;

        listEl.appendChild(li);
    });
}

function addTransaction(e) {
    e.preventDefault(); // Stop the page from reloading when I hit submit

    // Basic check to make sure the user didn't leave it blank
    if (descInput.value.trim() === '' || amountInput.value.trim() === '') {
        descInput.style.borderColor = '#ffb7b2';
        return;
    }

    const newTransaction = {
        id: Math.floor(Math.random() * 1000000), // Random ID for the delete function
        description: descInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        date: new Date().toLocaleDateString()
    };

    transactions.push(newTransaction);
    
    // Refresh the UI and save to local storage
    updateApp();
    
    // Clear form inputs
    form.reset();
    descInput.style.borderColor = '#f0f0f0';
}

// Global function so the 'onclick' attribute in my HTML works
window.removeTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateApp();
}

// Simple helper to keep storage and the UI in sync
function updateApp() {
    localStorage.setItem('sewa_data', JSON.stringify(transactions));
    renderList();
    updateSummary();
}

// Listen for the form submission
form.addEventListener('submit', addTransaction);

// Run everything once the page finishes loading
window.onload = () => {
    updateApp();
};