// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2504-FTB-ET-WEB-PT-SEANT/players";
const API = BASE + COHORT;

async function fetchPuppyData() {
  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const puppyData = await response.json();
    const players = puppyData.data.players;

    const layout = document.createElement("div");
    layout.style.backgroundColor = "#f9f9f9";
    layout.style.display = "flex";
    layout.style.gap = "20px";
    layout.style.padding = "20px";
    layout.style.maxWidth = "90%";
    layout.style.margin = "0 auto";
    document.body.appendChild(layout);

    const container = document.createElement("div");
    container.style.flex = "1";
    layout.appendChild(container);

    const detailsPanel = document.createElement("div");
    detailsPanel.style.flex = "1";
    detailsPanel.style.border = "1px solid #ccc";
    detailsPanel.style.borderRadius = "8px";
    detailsPanel.style.padding = "20px";
    detailsPanel.style.backgroundColor = "#f9f9f9";
    detailsPanel.innerHTML = "<h2>Click a puppy to see details</h2>";
    layout.appendChild(detailsPanel);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove Player";
    removeBtn.style.marginTop = "20px";
    removeBtn.style.padding = "10px 20px";
    removeBtn.style.backgroundColor = "#e74c3c";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "5px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.display = "none";
    layout.appendChild(removeBtn);

    let selectedCard = null;

    players.forEach((player) => {
      const card = document.createElement("div");
      card.style.backgroundColor = "blue";
      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.border = "1px solid #ccc";
      card.style.borderRadius = "8px";
      card.style.padding = "10px";
      card.style.width = "100%";
      card.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.1)";
      card.style.marginBottom = "10px";
      card.style.cursor = "pointer";

      const img = document.createElement("img");
      img.src = player.imageUrl;
      img.alt = player.name;
      img.style.width = "70px";
      img.style.height = "70px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "5px";
      img.style.marginRight = "15px";

      const name = document.createElement("h3");
      name.textContent = player.name;
      name.style.margin = "0";
      name.style.color = "white";
      name.style.textAlign = "center";
      name.style.flex = "1";

      card.appendChild(img);
      card.appendChild(name);
      container.appendChild(card);

      card.addEventListener("click", () => {
        selectedCard = card;
        removeBtn.style.display = "inline-block";
        detailsPanel.innerHTML = `
          <h2>${player.name}</h2>
          <img src="${player.imageUrl}" alt="${player.name}" style="width:150px; border-radius:8px; margin-bottom:10px;">
          <p><strong>Breed:</strong> ${player.breed}</p>
          <p><strong>Status:</strong> ${player.status}</p>
          <p><strong>Team ID:</strong> ${player.teamId}</p>
          <p><strong>ID:</strong> ${player.id}</p>
        `;
      });
      removeBtn.addEventListener("click", () => {
        if (selectedCard) {
          selectedCard.remove();
          selectedCard = null;
          detailsPanel.innerHTML = "<h2>Click a puppy to see details</h2>";
          removeBtn.style.display = "none";
        }
      });
    });

    return puppyData;
  } catch (error) {
    console.error("Failed to fetch puppy data:", error);
  }
}

fetchPuppyData();

const formSection = document.createElement("div");
formSection.style.maxWidth = "600px";
formSection.style.margin = "20px auto";
formSection.style.padding = "20px";
formSection.style.border = "1px solid #ccc";
formSection.style.borderRadius = "8px";
formSection.style.backgroundColor = "#gray";

const formTitle = document.createElement("h2");
formTitle.textContent = "Add New Puppy";
formSection.appendChild(formTitle);

function createInput(labelText, type = "text") {
  const wrapper = document.createElement("div");
  wrapper.style.marginBottom = "10px";

  const label = document.createElement("label");
  label.textContent = labelText;
  label.style.display = "block";
  label.style.marginBottom = "5px";

  const input = document.createElement("input");
  input.type = type;
  input.style.width = "100%";
  input.style.padding = "8px";
  input.style.borderRadius = "4px";
  input.style.border = "1px solid #ccc";

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  formSection.appendChild(wrapper);
  return input;
}

const nameInput = createInput("Name");
const breedInput = createInput("Breed");
const statusInput = createInput("Status (e.g. bench or field)");
const imageUrlInput = createInput("Image URL");

const submitBtn = document.createElement("button");
submitBtn.textContent = "Add Player";
submitBtn.style.padding = "10px 20px";
submitBtn.style.backgroundColor = "#2ecc71";
submitBtn.style.color = "white";
submitBtn.style.border = "none";
submitBtn.style.borderRadius = "5px";
submitBtn.style.cursor = "pointer";

formSection.appendChild(submitBtn);
document.body.appendChild(formSection);

submitBtn.addEventListener("click", async () => {
  const newPlayer = {
    name: nameInput.value.trim(),
    breed: breedInput.value.trim(),
    status: statusInput.value.trim(),
    imageUrl: imageUrlInput.value.trim(),
  };

  if (
    !newPlayer.name ||
    !newPlayer.breed ||
    !newPlayer.status ||
    !newPlayer.imageUrl
  ) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlayer),
    });

    if (!response.ok) {
      throw new Error(`Failed to add player: ${response.status}`);
    }

    const result = await response.json();
    alert("Player added successfully!");

    location.reload();
  } catch (error) {
    console.error("Error adding player:", error);
    alert("Error adding player. Check console for details.");
  }
});
