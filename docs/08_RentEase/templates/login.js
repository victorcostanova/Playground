document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const firstname_input = document.getElementById("firstname-input");
  const lastname_input = document.getElementById("lastname-input");
  const email_input = document.getElementById("email-input");
  const password_input = document.getElementById("password-input");
  const confirm_password_input = document.getElementById(
    "confirm-password-input"
  );
  const error_message = document.getElementById("error-message");
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let errors = [];

    if (firstname_input) {
      errors = getSignupFormErrors(
        firstname_input.value,
        lastname_input.value,
        email_input.value,
        password_input.value,
        confirm_password_input.value
      );
    } else {
      errors = getLoginFormErrors(email_input.value, password_input.value);
    }

    if (errors.length > 0) {
      error_message.classList.remove("success-message");
      error_message.classList.add("error-message");
      error_message.innerText = errors.join(". ");
    } else {
      error_message.innerText = "";
      if (firstname_input) {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const newUser = {
          firstname: firstname_input.value,
          lastname: lastname_input.value,
          email: email_input.value,
          password: password_input.value,
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedUser", JSON.stringify(newUser));
      } else {
        // Login
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const storedUser = users.find(
          (user) =>
            user.email === email_input.value &&
            user.password === password_input.value
        );

        const storedEmail = users.find(
          (user) => user.email === email_input.value
        );

        if (!storedEmail) {
          error_message.classList.remove("success-message");
          error_message.classList.add("error-message");
          error_message.innerText = "This email is not registered";
          return;
        }

        if (!storedUser) {
          error_message.classList.remove("success-message");
          error_message.classList.add("error-message");
          error_message.innerText = "Email and password do not match";
          return;
        }
        localStorage.setItem("loggedUser", JSON.stringify(storedUser));
      }
      window.location.href = "home.html";
    }
  });

  function getSignupFormErrors(
    firstname,
    lastname,
    email,
    password,
    confirm_password
  ) {
    let errors = [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((user) => user.email === email_input.value)) {
      errors.push("Email is already registered");
      email_input.parentElement.classList.add("incorrect");
      return errors;
    }

    if (firstname === "") {
      errors.push("First Name is required");
      firstname_input.parentElement.classList.add("incorrect");
    }

    if (lastname === "") {
      errors.push("Last Name is required");
      lastname_input.parentElement.classList.add("incorrect");
    }

    if (email === "") {
      errors.push("Email is required");
      email_input.parentElement.classList.add("incorrect");
    } else if (!isValidEmail(email)) {
      errors.push("Email is invalid");
      email_input.parentElement.classList.add("incorrect");
    }

    function isValidPassword(password) {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
      return hasLetter && hasNumber && hasSpecialChar;
    }

    if (password === "") {
      errors.push("Password is required");
      password_input.parentElement.classList.add("incorrect");
    }
    if (password && password.length < 6) {
      errors.push("Password must be at least 6 characters long");
      password_input.parentElement.classList.add("incorrect");
    }
    if (password && !isValidPassword(password))
      errors.push(
        "Password must contain letters, numbers, and a special character"
      );
    password_input.parentElement.classList.add("incorrect");

    if (confirm_password === "") {
      errors.push("Confirm Password is required");
      confirm_password_input.parentElement.classList.add("incorrect");
    } else if (password !== confirm_password) {
      errors.push("Passwords do not match");
      confirm_password_input.parentElement.classList.add("incorrect");
    }

    return errors;
  }

  function getLoginFormErrors(email, password) {
    let errors = [];

    if (email === "") {
      errors.push("Email is required");
      email_input.parentElement.classList.add("incorrect");
    } else if (!isValidEmail(email)) {
      errors.push("Email is invalid");
      email_input.parentElement.classList.add("incorrect");
    }

    if (password === "") {
      errors.push("Password is required");
      password_input.parentElement.classList.add("incorrect");
    }

    return errors;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const allInputs = [
    firstname_input,
    lastname_input,
    email_input,
    password_input,
    confirm_password_input,
  ].filter((input) => input !== null);

  allInputs.forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        if (input.parentElement.classList.contains("incorrect")) {
          input.parentElement.classList.remove("incorrect");
          error_message.innerText = "";
        }
      });
    }
  });
});
