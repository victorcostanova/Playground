document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logout-btn");

  if (!loggedUser) {
    window.location.href = "login.html";
    return;
  }

  welcome.innerText = `Hello, ${loggedUser.firstname} ${loggedUser.lastname}!`;

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    });
  }

  const flats = JSON.parse(localStorage.getItem("flats")) || [];
  const userFlats = flats.filter((flat) => flat.userEmail === loggedUser.email);
  displayFlats(userFlats);
});

function displayFlats(flats) {
  const flatsTable = document.getElementById("flats-table-body");
  flatsTable.innerHTML = "";

  if (flats.length === 0) {
    flatsTable.innerHTML =
      "<tr><td colspan='9'>You haven't added any flats yet.</td></tr>";
    return;
  }

  flats.forEach((flat) => {
    const flatRow = document.createElement("tr");

    flatRow.innerHTML = `
      <td>${flat.id}</td> 
      <td>${flat.city}</td>
      <td>${flat.street}, ${flat.stnum}</td>
      <td>${flat.area} </td>
      <td>${flat.ac ? "Yes" : "No"}</td>
      <td>${flat.year}</td>
      <td>${flat.price}</td>
      <td>${flat.date}</td>
      <td>
        <button class="btn-table" onclick="deleteFlat(${
          flat.id
        })">Delete</button>
        <button class="btn-table fav-btn" data-id="${
          flat.id
        }" onclick="favFlat(${flat.id})"
          ${flat.isFavorite ? 'style="background-color: green;" disabled' : ""}>
          ${flat.isFavorite ? "Favorited" : "Favorite"}
        </button>
      </td>
    `;

    flatsTable.appendChild(flatRow);
  });
}

function deleteFlat(flatId) {
  let flats = JSON.parse(localStorage.getItem("flats")) || [];
  flats = flats.filter((flat) => flat.id !== flatId);
  localStorage.setItem("flats", JSON.stringify(flats));

  window.location.reload();
}

function favFlat(flatId) {
  let flats = JSON.parse(localStorage.getItem("flats")) || [];
  const flatIndex = flats.findIndex((flat) => flat.id === flatId);

  if (flatIndex !== -1 && !flats[flatIndex].isFavorite) {
    flats[flatIndex].isFavorite = true;
    localStorage.setItem("flats", JSON.stringify(flats));

    const button = document.querySelector(`button[data-id='${flatId}']`);
    if (button) {
      button.style.backgroundColor = "green";
      button.innerText = "Favorited";
      button.disabled = true;
    }
  }
}

let sortOrder = {
  city: 1,
  area: 1,
  price: 1,
};

function sortTable(column) {
  let flats = JSON.parse(localStorage.getItem("flats")) || [];
  let userFlats = flats.filter(
    (flat) =>
      flat.userEmail === JSON.parse(localStorage.getItem("loggedUser")).email
  );

  userFlats.sort((a, b) => {
    if (column === "city") {
      return sortOrder[column] * a.city.localeCompare(b.city);
    } else {
      return sortOrder[column] * (a[column] - b[column]);
    }
  });

  sortOrder[column] *= -1;

  displayFlats(userFlats);
}
