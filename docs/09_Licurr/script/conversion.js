// Stores exchange rates of fiat currencies (always relative to USD)
let exchangeRates = {};
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

// Formats currency values
function formatCurrency(value, currencyCode) {
  if (isNaN(value)) return "";
  let precision = currencyCode === "BTC" ? 8 : currencyCode === "SAT" ? 0 : 2;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

// Updates input values
function updateCurrencyValues(baseInput, baseCurrency) {
  let rawValue = baseInput.value.replace(",", ".");
  rawValue = rawValue.replace(/(.*\..*)\./g, "$1");
  const baseValue = parseFloat(rawValue);

  if (isNaN(baseValue)) {
    document.querySelectorAll(".curropt input").forEach((input) => {
      if (input !== baseInput) input.value = "";
    });
    return;
  }

  const valueInUSD = convertToUSD(baseValue, baseCurrency);

  document.querySelectorAll(".curropt input").forEach((input) => {
    if (input === baseInput) return;
    const currencyCode = input.id.replace("-input", "").toUpperCase();
    input.value = formatCurrency(
      convertFromUSD(valueInUSD, currencyCode),
      currencyCode
    );

    // Exibir botão clear sempre que o input tiver valor
    const clearBtn = input.nextElementSibling;
    if (clearBtn && clearBtn.classList.contains("clear-btn")) {
      clearBtn.style.display = input.value ? "inline-block" : "none";
    }
  });

  // Exibir botão clear para o input base também
  const baseClearBtn = baseInput.nextElementSibling;
  if (baseClearBtn && baseClearBtn.classList.contains("clear-btn")) {
    baseClearBtn.style.display = baseInput.value ? "inline-block" : "none";
  }
}

// Clears an input field
function clearInput(input) {
  input.value = "";
  updateCurrencyValues(input, input.id.replace("-input", "").toUpperCase());

  const clearBtn = input.nextElementSibling;
  if (clearBtn && clearBtn.classList.contains("clear-btn")) {
    clearBtn.style.display = "none";
  }
}

// Initialize input listeners
async function initializeConversionHandlers() {
  await Promise.all([fetchExchangeRates(), fetchBTCPrice()]);

  function attachInputListeners() {
    document.querySelectorAll(".curropt input").forEach((input) => {
      if (!input.dataset.listenerAttached) {
        input.setAttribute("autocomplete", "off");
        input.setAttribute("inputmode", "decimal");
        input.setAttribute("step", "any");

        input.addEventListener("input", (event) => {
          let val = event.target.value.replace(/[^0-9.,]/g, "");
          val = val.replace(/(.*[.,].*)[.,]/g, "$1");
          event.target.value = val;

          const baseCurrency = event.target.id
            .replace("-input", "")
            .toUpperCase();
          updateCurrencyValues(event.target, baseCurrency);
        });

        input.dataset.listenerAttached = "true";
      }

      // Configure clear button visibility
      const clearBtn = input.nextElementSibling;
      if (
        clearBtn &&
        clearBtn.classList.contains("clear-btn") &&
        !clearBtn.dataset.listenerAttached
      ) {
        clearBtn.addEventListener("click", () => clearInput(input));
        clearBtn.dataset.listenerAttached = "true";
      }
    });
  }

  // Observe DOM changes for new inputs
  const observer = new MutationObserver(() => attachInputListeners());
  observer.observe(document.body, { childList: true, subtree: true });

  attachInputListeners();

  // Update exchange rates every 60 seconds
  setInterval(async () => {
    await Promise.all([fetchExchangeRates(), fetchBTCPrice()]);
  }, 60000);
}

export { initializeConversionHandlers };
