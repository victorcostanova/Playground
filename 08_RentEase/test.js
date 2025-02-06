function revealPass() {
  const password_input = document.getElementById("password-input");
  const confirm_password_input = document.getElementById(
    "confirm-password-input"
  );
  const eyeOpen = document.getElementById("open-icon");
  const eyeClosed = document.getElementById("closed-icon");

  if (password_input.type === "password") {
    password_input.type = "text";
    confirm_password_input.type = "text";
    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
  } else {
    password_input.type = "password";
    confirm_password_input.type = "password";
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
  }
}

const eyeOpen = document.getElementById("open-icon");
const eyeClosed = document.getElementById("closed-icon");
eyeOpen.style.display = "block";
eyeClosed.style.display = "none";
