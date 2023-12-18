const addExpenseButton = document.getElementById("add-expense-button");
const deleteIncome = document.querySelectorAll(".delete-income");
const deleteExpense = document.querySelectorAll(".delete-expense");

const parentContainer = document.getElementById("parent-container");

const descriptionInput = document.getElementById("description");
const valueInput = document.getElementById("value");
const selectInput = document.getElementById("type");

const incomeList = document.getElementById("income-list");
const expenseList = document.getElementById("expense-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const availableBudget = document.getElementById("available-budget");
let sufficient = true;

function formatMoney(value) {
    return Math.abs(Number(value)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
    });
}

function calculateIncome() {
    let sum = 0;
    for (let item of incomeList.children) {
        const valueString =
            item.children[0].children[1].children[0].innerHTML.replace(/,/g, "");

        console.log(parseFloat(valueString));
        sum += parseFloat(valueString);
    }
    totalIncome.innerHTML = formatMoney(sum);
}
// calculateIncome();

/**
 * Task 1: Calculate total expense
 */
function calculateExpense() {
    let sum = 0;
    for (let item of expenseList.children) {
        const valueString =
            item.children[0].children[1].children[0].innerHTML.replace(/,/g, "");

        console.log(parseFloat(valueString));
        sum += Math.abs(parseFloat(valueString));
    }
    let income = parseFloat(totalIncome.innerHTML.replace(/,/g, ""));
    // console.log(sum, income);
    if (sum > income) {
        sufficient = false;
    } else {
        totalExpense.innerHTML = formatMoney(sum);
    }
}

/**
 * Task 2: Calculate the budget
 */

function calculateBudget() {

    let income = parseFloat(totalIncome.innerHTML.replace(/,/g, ""));
    let expense = parseFloat(totalExpense.innerHTML.replace(/,/g, ""));

    let budget = income - expense;
    availableBudget.innerHTML = formatMoney(budget);
    // console.log(income, expense, typeof(budget));
}

/**
 * Task 3: Delete Entry
 */


parentContainer.addEventListener("click", function(e) {
    const target = e.target;

    // Check if the clicked element has the "delete-income" or "delete-expense" class
    if (target.classList.contains("delete-income")) {
        handleDeleteIncome(target);
    } else if (target.classList.contains("delete-expense")) {
        handleDeleteExpense(target);
    }
});

function handleDeleteIncome(target) {
    let decreaseIncome = target.previousElementSibling.innerHTML.replace(/,/g, "");
    decreaseIncome = parseFloat(decreaseIncome);
    let income = parseFloat(totalIncome.innerHTML.replace(/,/g, ""));
    let expense = parseFloat(totalExpense.innerHTML.replace(/,/g, ""));
    let budget = parseFloat(availableBudget.innerHTML.replace(/,/g, ""));

    income -= decreaseIncome;
    budget -= decreaseIncome;
    if (income < expense) {
        alert("Sorry! Expense can't higher than income");
    } else {
        totalIncome.innerHTML = formatMoney(income);
        availableBudget.innerHTML = formatMoney(budget);

        target.parentNode.parentNode.parentNode.remove();
    }
}

function handleDeleteExpense(target) {
    let decreaseExpense = target.previousElementSibling.innerHTML.replace(/,/g, "");
    decreaseExpense = parseFloat(Math.abs(decreaseExpense));
    let expense = parseFloat(totalExpense.innerHTML.replace(/,/g, ""));
    let budget = parseFloat(availableBudget.innerHTML.replace(/,/g, ""));

    expense -= decreaseExpense;
    budget += decreaseExpense;
    totalExpense.innerHTML = formatMoney(expense);
    availableBudget.innerHTML = formatMoney(budget);

    target.parentNode.parentNode.parentNode.remove();
}
// deleteIncome.forEach((item) => {
//     item.addEventListener('click', (e) => {
//         // console.log(e.target.previousElementSibling.innerHTML);
//         let decreaseIncome = e.target.previousElementSibling.innerHTML.replace(/,/g, "");
//         decreaseIncome = parseFloat(decreaseIncome);
//         let income = parseFloat(totalIncome.innerHTML.replace(/,/g, ""));
//         let budget = parseFloat(availableBudget.innerHTML.replace(/,/g, ""))

//         income -= decreaseIncome;
//         budget -= decreaseIncome;
//         totalIncome.innerHTML = formatMoney(income);
//         availableBudget.innerHTML = formatMoney(budget);
//         console.log(parseFloat(decreaseIncome));
//         e.target.parentNode.parentNode.parentNode.remove();

//     })
// })
// deleteExpense.forEach((item) => {
//     item.addEventListener('click', (e) => {
//         // console.log(e.target.previousElementSibling.innerHTML);
//         let decreaseExpense = e.target.previousElementSibling.innerHTML.replace(/,/g, "");
//         decreaseExpense = parseFloat(Math.abs(decreaseExpense));
//         let expense = parseFloat(totalExpense.innerHTML.replace(/,/g, ""));
//         let budget = parseFloat(availableBudget.innerHTML.replace(/,/g, ""))

//         expense -= decreaseExpense;
//         budget += decreaseExpense;
//         totalExpense.innerHTML = formatMoney(expense);
//         availableBudget.innerHTML = formatMoney(budget);
//         console.log(parseFloat(decreaseExpense));

//         e.target.parentNode.parentNode.parentNode.remove();
//     })
// })

function addEntry() {
    const type = selectInput.value;
    const description = descriptionInput.value;
    const value = valueInput.value;

    // data validation
    const errors = [];
    if (description.length === 0) {
        errors.push("Please enter the description");
    }
    if (value.length === 0) {
        errors.push("Please enter the value");
    }
    if (errors.length > 0) {
        alert(errors);
        return;
    }

    // insert entry
    const list = type === "income" ? incomeList : expenseList;
    const sign = type === "income" ? "+" : "-";
    const colorClass = type === "income" ? "text-green-600" : "text-red-600";
    const remove_item = type === "income" ? "delete-income" : "delete-expense";
    let newEntryHtml = `
    <li class="py-2.5">
      <div class="group flex justify-between gap-2 text-sm">
        <span>${description}</span>
        <div>
          <span class="${colorClass}">${sign}${formatMoney(value)}</span>
          <span
            class="${remove_item} ml-2 hidden cursor-pointer font-medium text-red-500 group-hover:inline-block"
          >
            Delete
          </span>
        </div>
      </div>
    </li>
    `;

    // Approach 1:

    const inner = list.innerHTML;
    list.innerHTML += newEntryHtml;
    // update total income value
    if (sign == '+') {
        calculateIncome();

    } else {
        calculateExpense();
    }
    let budget = parseFloat(availableBudget.innerHTML.replace(/,/g, ""));
    // list.innerHTML += newEntryHtml;
    if (!sufficient || (value > availableBudget)) {
        // return;
        alert('Insufficient balance. Please add some money..');
        list.innerHTML = inner;

    } else {
        calculateBudget();
    }
    descriptionInput.value = "";
    valueInput.value = "";
}

addExpenseButton.addEventListener("click", addEntry);