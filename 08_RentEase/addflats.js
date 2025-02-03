document.addEventListener("DOMContentLoaded", () => {
  const addform = document.getElementById("addform");
  const city_input = document.getElementById("city-input");
  const street_input = document.getElementById("street-input");
  const stnum_input = document.getElementById("stnum-input");
  const area_input = document.getElementById("area-input");
  const ac_input = document.getElementById("ac-input");
  const year_input = document.getElementById("year-input");
  const price_input = document.getElementById("price-input");
  const date_input = document.getElementById("date-input");
  const flat_error_message = document.getElementById("flat-error-message");
  const logoutBtn = document.getElementById("logout-btn");
  const welcome = document.getElementById("welcome");
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const currentPage = window.location.pathname;

  if (loggedUser) {
    // if user is logged, and the page is login or signup, redirect to home
    if (
      currentPage.includes("login.html") ||
      currentPage.includes("index.html")
    ) {
      window.location.href = "home.html";
    }
  } else {
    // if user is not logged, and the page is not login or signup, redirect to login
    if (
      !(
        currentPage.includes("login.html") || currentPage.includes("index.html")
      )
    ) {
      window.location.href = "login.html";
    }
  }

  //If user is logged, Hellor, user
  if (loggedUser) {
    welcome.innerText = `Hello, ${loggedUser.firstname} ${loggedUser.lastname}!`;
  }
  //if user logged out, redirect to login page

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    });
  }

  addform.addEventListener("submit", (e) => {
    e.preventDefault();

    let errors = [];

    errors = getAddFormErrors(
      city_input.value,
      street_input.value,
      stnum_input.value,
      area_input.value,
      ac_input.value,
      year_input.value,
      price_input.value,
      date_input.value
    );

    if (errors.length > 0) {
      flat_error_message.innerText = errors.join(". ");
      flat_error_message.classList.remove("success-message");
      flat_error_message.classList.add("error-message");
    } else {
      flat_error_message.innerText = "Added successfully!";
      flat_error_message.classList.remove("error-message");
      flat_error_message.classList.add("success-message");

      const newFlat = {
        id: Date.now(),
        userEmail: loggedUser.email,
        city: city_input.value,
        street: street_input.value,
        stnum: stnum_input.value,
        area: area_input.value,
        ac: ac_input.value,
        year: year_input.value,
        price: price_input.value,
        date: date_input.value,
      };

      const flats = JSON.parse(localStorage.getItem("flats")) || [];
      flats.push(newFlat);
      localStorage.setItem("flats", JSON.stringify(flats));

      // Limpar formulário
      addform.reset();

      //const flat = JSON.parse(localStorage.getItem("flat")) || [];
      /*
        const newUser = {
          firstname: firstname_input.value,
          lastname: lastname_input.value,
          email: email_input.value,
          password: password_input.value,
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedUser", JSON.stringify(newUser));
        */
    }
  });

  function getAddFormErrors(city, street, stnum, area, ac, year, price, date) {
    let errors = [];
    //const flats = JSON.parse(localStorage.getItem("flats")) || [];

    if (city === "") {
      errors.push("City is required");
      city_input.parentElement.classList.add("incorrect");
    }
    if (street === "") {
      errors.push("Street is required");
      street_input.parentElement.classList.add("incorrect");
    }
    if (stnum === "") {
      errors.push("Street number is required");
      stnum_input.parentElement.classList.add("incorrect");
    }
    if (area === "") {
      errors.push("Area is required");
      area_input.parentElement.classList.add("incorrect");
    }
    if (ac === "") {
      errors.push("Air Conditioner is required");
      ac_input.parentElement.classList.add("incorrect");
    }
    if (year === "") {
      errors.push("Year is required");
      year_input.parentElement.classList.add("incorrect");
    }
    if (price === "") {
      errors.push("Price is required");
      price_input.parentElement.classList.add("incorrect");
    }
    if (date === "") {
      errors.push("Date is required");
      date_input.parentElement.classList.add("incorrect");
    }
    return errors;
  }

  const allInputs = [
    city_input,
    street_input,
    stnum_input,
    area_input,
    ac_input,
    year_input,
    price_input,
    date_input,
  ].filter((input) => input !== null);

  allInputs.forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        if (input.parentElement.classList.contains("incorrect")) {
          input.parentElement.classList.remove("incorrect");
          flat_error_message.innerText = "";
        } else {
          flat_error_message.innerText = "";
          flat_error_message.classList.remove(
            "success-message",
            "error-message"
          );
        }
      });
    }
  });
});
