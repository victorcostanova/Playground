// Stores exchange rates of fiat currencies (always relative to USD)
let exchangeRates = {};
// Stores the BTC price in USD
let btcPriceInUSD = 0;

// Fetches exchange rates relative to USD
async function fetchExchangeRates() {
  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const data = await response.json();
    exchangeRates = { ...data.rates };
    exchangeRates["USD"] = 1;
    console.log("Exchange rates updated:", exchangeRates);
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
  }
}

// Fetches the Bitcoin price in USD
async function fetchBTCPrice() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    const data = await response.json();
    btcPriceInUSD = data.bitcoin.usd;
    console.log("BTC price in USD updated:", btcPriceInUSD);
  } catch (error) {
    console.error("Error fetching BTC price in USD:", error);
  }
}

// Converts value from any currency to USD
function convertToUSD(value, fromCurrency) {
  if (!value || isNaN(value)) return 0;

  switch (fromCurrency) {
    case "USD":
      return value;
    case "BTC":
      return value * btcPriceInUSD;
    case "SAT":
      return (value / 100000000) * btcPriceInUSD;
    default:
      return value / exchangeRates[fromCurrency];
  }
}

// Converts value from USD to any currency
function convertFromUSD(valueInUSD, toCurrency) {
  if (!valueInUSD || isNaN(valueInUSD)) return 0;

  switch (toCurrency) {
    case "USD":
      return valueInUSD;
    case "BTC":
      return valueInUSD / btcPriceInUSD;
    case "SAT":
      return (valueInUSD / btcPriceInUSD) * 100000000;
    default:
      return valueInUSD * exchangeRates[toCurrency];
  }
}

// Updates the values in all currencies based on the user's input
function updateCurrencyValues(baseInput, baseCurrency) {
  const baseValue = parseFloat(baseInput.value);

  // Update visibility of the clear button for all inputs
  document.querySelectorAll(".curropt input").forEach((input) => {
    const clearBtn = input.nextElementSibling;
    if (clearBtn && clearBtn.classList.contains("clear-btn")) {
      clearBtn.style.display = input.value ? "block" : "none";
    }
  });

  if (isNaN(baseValue)) {
    // If the value is not a valid number, clear all other inputs
    document.querySelectorAll(".curropt input").forEach((input) => {
      if (input !== baseInput) {
        input.value = "";
      }
    });
    return;
  }

  // Convert the base value to USD
  const valueInUSD = convertToUSD(baseValue, baseCurrency);
  console.log(
    `Value in USD: ${valueInUSD} (converted from ${baseValue} ${baseCurrency})`
  );

  document.querySelectorAll(".curropt input").forEach((input) => {
    if (input === baseInput) return;

    const currencyCode = input.id.replace("-input", "").toUpperCase();
    const convertedValue = convertFromUSD(valueInUSD, currencyCode);

    // Set the appropriate precision for each type of currency
    let precision;
    switch (currencyCode) {
      case "SAT":
        precision = 0;
        break;
      case "BTC":
        precision = 8;
        break;
      default:
        precision = 2;
    }

    input.value = convertedValue.toFixed(precision);

    // Update visibility of the clear button
    const clearBtn = input.nextElementSibling;
    if (clearBtn && clearBtn.classList.contains("clear-btn")) {
      clearBtn.style.display = input.value ? "block" : "none";
    }
  });
}

// Function to clear a specific input
function clearInput(input) {
  input.value = "";
  const clearBtn = input.nextElementSibling;
  if (clearBtn && clearBtn.classList.contains("clear-btn")) {
    clearBtn.style.display = "none";
  }
  // Clear all other inputs as well
  document.querySelectorAll(".curropt input").forEach((otherInput) => {
    if (otherInput !== input) {
      otherInput.value = "";
      const otherClearBtn = otherInput.nextElementSibling;
      if (otherClearBtn && otherClearBtn.classList.contains("clear-btn")) {
        otherClearBtn.style.display = "none";
      }
    }
  });
}

// Initializes event handlers for all inputs
async function initializeConversionHandlers() {
  // Fetch initial rates
  await Promise.all([fetchExchangeRates(), fetchBTCPrice()]);

  function attachInputListeners() {
    document.querySelectorAll(".curropt input").forEach((input) => {
      if (!input.dataset.listenerAttached) {
        input.addEventListener("input", (event) => {
          const baseCurrency = event.target.id
            .replace("-input", "")
            .toUpperCase();
          updateCurrencyValues(event.target, baseCurrency);
        });

        // Mark that the listener has already been added
        input.dataset.listenerAttached = "true";
      }

      // Set up the clear button
      const clearBtn = input.nextElementSibling;
      if (
        clearBtn &&
        clearBtn.classList.contains("clear-btn") &&
        !clearBtn.dataset.listenerAttached
      ) {
        clearBtn.addEventListener("click", () => clearInput(input));
        clearBtn.dataset.listenerAttached = "true"; // Prevent adding multiple events
      }
    });
  }

  // Observe DOM changes to dynamically add listeners
  const observer = new MutationObserver(() => {
    attachInputListeners();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  attachInputListeners(); // Call the function initially for existing inputs

  // Update rates every 1 minute
  setInterval(async () => {
    await Promise.all([fetchExchangeRates(), fetchBTCPrice()]);
  }, 60000);
}

export { initializeConversionHandlers };
