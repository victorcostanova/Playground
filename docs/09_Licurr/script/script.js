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
  const STORAGE_KEY = "savedCurrencies";
  const EXCLUDED_CURRENCIES = ["BTC", "SAT"];

  function saveCurrenciesToStorage() {
    const currencyElements = document.querySelectorAll(".curropt");
    const savedCurrencies = Array.from(currencyElements)
      .map((element) => {
        const label = element.querySelector("label").textContent.split(" ");
        return {
          code: label[0],
          symbol: label[1],
        };
      })
      .filter((currency) => !EXCLUDED_CURRENCIES.includes(currency.code));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCurrencies));
  }

  // Load savedcurrencies from the localStorage
  function loadCurrenciesFromStorage() {
    const savedCurrencies = localStorage.getItem(STORAGE_KEY);
    if (savedCurrencies) {
      const currencies = JSON.parse(savedCurrencies);
      currencies.forEach((currency) => {
        if (!EXCLUDED_CURRENCIES.includes(currency.code)) {
          createCurrencyInput(currency.code, currency.symbol);
        }
      });
    }
  }
  //Clear and Delete button functionality
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
        const curropt = button.closest(".curropt");
        if (curropt) {
          const currencyCode = curropt
            .querySelector("label")
            .textContent.split(" ")[0];

          selectedCurrencies.delete(currencyCode);
          curropt.remove();
          if (!EXCLUDED_CURRENCIES.includes(currencyCode)) {
            saveCurrenciesToStorage();
          }
        }
      });
    });
  }

  //Creates the menu with all FIAT options to be added
  function createCurrencySelector() {
    const template = document.querySelector(".currency-selector");
    const selector = template.cloneNode(true);
    selector.classList.add("show");

    const dropdownMenu = selector.querySelector(".dropdown-menu");
    dropdownMenu.innerHTML = "";

    currencies.forEach((currency) => {
      const option = document.createElement("div");
      option.className = "dropdown-item";
      option.textContent = `${currency.code} ${currency.symbol} ${currency.name}`;
      //If already exists on the list, the option will be unavaiable
      if (selectedCurrencies.has(currency.code)) {
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

    const selectorInput = selector.querySelector("input");
    selectorInput.addEventListener("click", () => {
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });

    return selector;
  }

  //Create and adding the new Currency selected to the  main list
  function createCurrencyInput(code, symbol) {
    if (selectedCurrencies.has(code)) return;

    selectedCurrencies.add(code);

    const curropt = document.createElement("div");
    curropt.className = "curropt";

    curropt.innerHTML = `
      <label for="${code.toLowerCase()}">${code} ${symbol}</label>
      <input type="text" id="${code.toLowerCase()}-input" placeholder="value" />
      <button class="clear-btn">&times;</button>
      <button class="del-btn">-</button>
    `;

    wrapper.insertBefore(curropt, addBtn);
    initializeInputHandlers();

    if (!EXCLUDED_CURRENCIES.includes(code)) {
      saveCurrenciesToStorage();
    }
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

  loadCurrenciesFromStorage();
  initializeInputHandlers();
});
