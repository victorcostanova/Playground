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

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o envio do formulário

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
      error_message.innerText = errors.join(". ");
    } else {
      error_message.innerText = ""; // Limpa a mensagem de erro se não houver erros
      form.submit(); // Envia o formulário se não houver erros
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
    // Regex simples para validar e-mail
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
