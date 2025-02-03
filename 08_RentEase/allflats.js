document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const currentPage = window.location.pathname;
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logout-btn");
  const flatsTable = document.getElementById("flats-table-body");

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
  const flats = JSON.parse(localStorage.getItem("flats")) || [];
  const userFlats = flats.filter((flat) => flat.userEmail === loggedUser.email);
  if (userFlats.length === 0) {
    flatsTable.innerHTML =
      "<tr><td colspan='9'>You haven't added any flats yet.</td></tr>";
    return;
  }

  userFlats.forEach((flat) => {
    const flatRow = document.createElement("tr");

    flatRow.innerHTML = `
      <td>${flat.id}</td> 
      <td>${flat.city}</td>
      <td>${flat.street}, ${flat.stnum}</td>
      <td>${flat.area} m²</td>
      <td>${flat.ac ? "Yes" : "No"}</td>
      <td>${flat.year}</td>
      <td>$${flat.price}</td>
      <td>${flat.date}</td>
      <td>
        <button class="btn-table" onclick="deleteFlat(${
          flat.id
        })">Delete</button>
        <button class="btn-table" onclick="favFlat(${
          flat.id
        })">Favorite</button>
      </td>
    `;

    flatsTable.appendChild(flatRow);
  });
});

// Function to handle flat deletion
function deleteFlat(flatId) {
  const flats = JSON.parse(localStorage.getItem("flats")) || [];
  const updatedFlats = flats.filter((flat) => flat.id !== flatId);
  localStorage.setItem("flats", JSON.stringify(updatedFlats));

  // Refresh the table to reflect the deletion
  window.location.reload();
}
