// Available currencies data
const currencies = [
  { code: "USD", symbol: "🇺🇸" },
  { code: "EUR", symbol: "🇪🇺" },
  { code: "GBP", symbol: "🇬🇧" },
  { code: "JPY", symbol: "🇯🇵" },
  { code: "AUD", symbol: "🇦🇺" },
  // Add more currencies as needed
];

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".wrapper");
  const addBtn = document.querySelector(".addBtn");
  let selectorCount = 0;
  const MAX_CURRENCIES = 7;

  // Handle existing inputs and clear buttons
  function initializeInputHandlers() {
    const inputs = document.querySelectorAll(".curropt input");
    const clearBtns = document.querySelectorAll(".clear-btn");

    inputs.forEach((input, index) => {
      const clearBtn = clearBtns[index];

      input.addEventListener("input", () => {
        clearBtn.style.display = input.value ? "block" : "none";
      });

      clearBtn.addEventListener("click", () => {
        inputs.forEach((input) => (input.value = ""));
        clearBtns.forEach((btn) => (btn.style.display = "none"));
        inputs[index].focus();
      });
    });
  }

  // Create currency selector
  function createCurrencySelector() {
    const selector = document.createElement("div");
    selector.className = "currency-selector";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Select currency";
    input.readOnly = true;

    const dropdownIcon = document.createElement("span");
    dropdownIcon.className = "dropdown-icon";
    dropdownIcon.textContent = "▼";

    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "dropdown-menu";

    // Add currencies to dropdown
    currencies.forEach((currency) => {
      const option = document.createElement("div");
      option.className = "dropdown-item";
      option.textContent = `${currency.code} ${currency.symbol}`;
      option.addEventListener("click", () => {
        createCurrencyInput(currency.code, currency.symbol);
        selector.remove();
        selectorCount--;
      });
      dropdownMenu.appendChild(option);
    });

    selector.appendChild(input);
    selector.appendChild(dropdownIcon);
    selector.appendChild(dropdownMenu);

    // Toggle dropdown on click
    input.addEventListener("click", () => {
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });

    return selector;
  }

  // Create new currency input
  function createCurrencyInput(code, symbol) {
    const curropt = document.createElement("div");
    curropt.className = "curropt";

    curropt.innerHTML = `
        <label for="${code.toLowerCase()}" id="${code.toLowerCase()}">${code} ${symbol}</label>
        <input type="number" placeholder="value" />
        <button class="clear-btn" id="clearButton">&times;</button>
      `;

    // Insert before the add button
    wrapper.insertBefore(curropt, addBtn);
    initializeInputHandlers();
  }

  // Add button click handler
  addBtn.addEventListener("click", () => {
    const currentCurrencies = document.querySelectorAll(".curropt").length;

    if (currentCurrencies >= MAX_CURRENCIES) {
      alert("Maximum number of currencies reached (7)");
      return;
    }

    if (selectorCount === 0) {
      const selector = createCurrencySelector();
      wrapper.insertBefore(selector, addBtn);
      selectorCount++;
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".currency-selector") &&
      !e.target.closest(".addBtn")
    ) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "none";
      });
    }
  });

  // Initialize existing inputs
  initializeInputHandlers();
});
