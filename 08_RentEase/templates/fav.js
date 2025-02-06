document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const flatsTable = document.getElementById("flats-table-body");

  if (!loggedUser) {
    window.location.href = "login.html";
    return;
  }

  const flats = JSON.parse(localStorage.getItem("flats")) || [];
  const userFlats = flats.filter(
    (flat) => flat.userEmail === loggedUser.email && flat.isFavorite
  );

  if (userFlats.length === 0) {
    flatsTable.innerHTML =
      "<tr><td colspan='9'>You haven't favorited any flats yet.</td></tr>";
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
          <button class="btn-table" onclick="deleteFavFlat(${
            flat.id
          })">Unfavorite</button>
        </td>
      `;

    flatsTable.appendChild(flatRow);
  });
});

function deleteFavFlat(flatId) {
  const flats = JSON.parse(localStorage.getItem("flats")) || [];
  const flatIndex = flats.findIndex((flat) => flat.id === flatId);

  if (flatIndex !== -1) {
    flats[flatIndex].isFavorite = false; // Unfavorite the flat
    localStorage.setItem("flats", JSON.stringify(flats));

    window.location.reload();
  }
}
