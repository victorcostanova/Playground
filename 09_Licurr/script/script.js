import currencies from "./currencies.js";

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".wrapper");
  const addBtn = document.querySelector(".addBtn");
  let selectorCount = 0;
  const MAX_CURRENCIES = 7;

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

  function createCurrencySelector() {
    // Clone the template
    const template = document.querySelector(".currency-selector");
    const selector = template.cloneNode(true);
    selector.classList.add("show");

    const dropdownMenu = selector.querySelector(".dropdown-menu");

    // Add currencies to dropdown
    currencies.forEach((currency) => {
      const option = document.createElement("div");
      option.className = "dropdown-item";
      option.textContent = `${currency.code} ${currency.symbol} ${currency.name}`;
      option.addEventListener("click", () => {
        createCurrencyInput(currency.code, currency.symbol);
        selector.remove();
        selectorCount--;
      });
      dropdownMenu.appendChild(option);
    });

    // Toggle dropdown on click
    const selectorInput = selector.querySelector("input");
    selectorInput.addEventListener("click", () => {
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });

    return selector;
  }

  function createCurrencyInput(code, symbol) {
    const curropt = document.createElement("div");
    curropt.className = "curropt";

    curropt.innerHTML = `
      <label for="${code.toLowerCase()}">${code} ${symbol}</label>
      <input type="number" id="${code.toLowerCase()}-input" placeholder="valor" />
      <button class="clear-btn">&times;</button>
    `;

    wrapper.insertBefore(curropt, addBtn);
    initializeInputHandlers();
  }

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
