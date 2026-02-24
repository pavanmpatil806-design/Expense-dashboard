const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const tableBody = document.getElementById('table-body');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

let chart;

function updateUI() {
    tableBody.innerHTML = "";

    let income = 0;
    let expense = 0;

    const categoryTotals = {
        Food: 0,
        Travel: 0,
        Shopping: 0,
        College: 0
    };

    transactions.forEach(t => {
        if (t.amount > 0) {
            income += t.amount;
        } else {
            expense += t.amount;
            categoryTotals[t.category] += Math.abs(t.amount);
        }

        const row = `
            <tr>
                <td>${t.text}</td>
                <td>${t.category}</td>
                <td>${t.amount}</td>
                <td><button onclick="deleteTransaction(${t.id})">❌</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    balanceEl.innerText = "₹" + (income + expense);
    incomeEl.innerText = "₹" + income;
    expenseEl.innerText = "₹" + Math.abs(expense);

    updateChart(categoryTotals);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateChart(categoryTotals) {
    const data = Object.values(categoryTotals);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById('chart'), {
        type: 'bar',
        data: {
            labels: ['Food', 'Travel', 'Shopping', 'College'],
            datasets: [{
                label: 'Expenses',
                data: data
            }]
        }
    });
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const newTransaction = {
        id: Date.now(),
        text: text.value,
        category: category.value,
        amount: parseInt(amount.value)
    };

    transactions.push(newTransaction);
    text.value = "";
    amount.value = "";

    updateUI();
});

updateUI();