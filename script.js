const transactionForm = document.getElementById("transactionForm");
const transactionTable = document.getElementById("transactionTable");

const totalRevenueDisplay = document.getElementById("totalRevenue");
const totalExpensesDisplay = document.getElementById("totalExpenses");
const netIncomeDisplay = document.getElementById("netIncome");

const STORAGE_KEY = "businessTransactions";

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);
}

let transactionData =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function updateReport() {
    let revenueTotal = 0;
    let expenseTotal = 0;

    if (transactionTable) {
        transactionTable.innerHTML = "";
    }

    transactionData.forEach(function(transaction) {
        if (transaction.type === "Revenue") {
            revenueTotal += transaction.amount;
        }

        if (transaction.type === "Expense") {
            expenseTotal += transaction.amount;
        }

        if (transactionTable) {
            transactionTable.insertAdjacentHTML(
                "beforeend",
                `
                <tr>
                    <td>${transaction.date}</td>
                    <td>${transaction.type}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.category}</td>
                    <td>${formatCurrency(transaction.amount)}</td>
                </tr>
                `
            );
        }
    });

    const netIncomeAmount = revenueTotal - expenseTotal;

    if (totalRevenueDisplay) {
        totalRevenueDisplay.textContent =
            formatCurrency(revenueTotal);
    }

    if (totalExpensesDisplay) {
        totalExpensesDisplay.textContent =
            formatCurrency(expenseTotal);
    }

    if (netIncomeDisplay) {
        netIncomeDisplay.textContent =
            formatCurrency(netIncomeAmount);
        netIncomeDisplay.classList.toggle(
            "negative-profit",
            netIncomeAmount < 0
        );
        netIncomeDisplay.classList.toggle(
            "positive-profit",
            netIncomeAmount >= 0
        )
        
    }
}

if (transactionForm) {
    transactionForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const transactionType =
            document.getElementById("transactionType").value;

        const description =
            document.getElementById("description").value;

        const category =
            document.getElementById("category").value;

        const amount =
            Number(document.getElementById("amount").value);

        const date =
            document.getElementById("date").value;

        const newTransaction = {
            type: transactionType,
            description: description,
            category: category,
            amount: amount,
            date: date
        };

        transactionData.push(newTransaction);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transactionData)
        );

        updateReport();

        transactionForm.reset();

        alert("Transaction saved successfully!");
    });
}

updateReport();