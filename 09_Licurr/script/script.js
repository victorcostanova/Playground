import currencies from "./currencies.js";
import { initializeConversionHandlers } from "./conversion.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeConversionHandlers();
});

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".wrapper");
  const addBtn = document.querySelector(".addBtn");
  let selectorCount = 0;
  const MAX_CURRENCIES = 7;
  const selectedCurrencies = new Set();

  function initializeInputHandlers() {
    const inputs = document.querySelectorAll(".curropt input");
    const clearBtns = document.querySelectorAll(".clear-btn");
    const delBtns = document.querySelectorAll(".del-btn");

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

    delBtns.forEach((button) => {
      button.addEventListener("click", () => {
        //Find the closest .curropt father
        const curropt = button.closest(".curropt");
        if (curropt) {
          const currencyCode = curropt
            .querySelector("label")
            //split the text and get the 0 element (code ex USD)
            .textContent.split(" ")[0];

          selectedCurrencies.delete(currencyCode);
          curropt.remove();
        }
      });
    });
  }

  function createCurrencySelector() {
    // Clone the template
    const template = document.querySelector(".currency-selector");
    const selector = template.cloneNode(true);
    selector.classList.add("show");

    const dropdownMenu = selector.querySelector(".dropdown-menu");
    dropdownMenu.innerHTML = "";

    // Add currencies to dropdown
    currencies.forEach((currency) => {
      const option = document.createElement("div");
      option.className = "dropdown-item";
      option.textContent = `${currency.code} ${currency.symbol} ${currency.name}`;
      if (selectedCurrencies.has(currency.code)) {
        //Block clicks if already on the list
        option.style.opacity = "0.5";
        option.style.pointerEvents = "none";
      } else {
        option.addEventListener("click", () => {
          createCurrencyInput(currency.code, currency.symbol);
          selector.remove();
          selectorCount--;
        });
      }
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
    if (selectedCurrencies.has(code)) return;

    selectedCurrencies.add(code);

    const curropt = document.createElement("div");
    curropt.className = "curropt";

    curropt.innerHTML = `
      <label for="${code.toLowerCase()}">${code} ${symbol}</label>
      <input type="number" id="${code.toLowerCase()}-input" placeholder="value" />
      <button class="clear-btn">&times;</button>
      <button class="del-btn">-</button>
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
