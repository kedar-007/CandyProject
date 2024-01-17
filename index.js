document.addEventListener("DOMContentLoaded", () => {
  loadCandies();
});

async function addItem() {
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const quantity = document.getElementById("quantity").value;

  if (name && description && quantity) {
      const candy = { name, description, quantity };
      await saveCandy(candy);
      clearForm();
      loadCandies();
  }
}

async function saveCandy(candy) {
  try {
      const response = await axios.post('https://crudcrud.com/api/221d7eea38c0431e9e8de121a333e156/candies', candy);
      console.log(response.data);
  } catch (error) {
      console.error('Error saving candy:', error);
  }
}

async function loadCandies() {
  try {
      const response = await axios.get('https://crudcrud.com/api/221d7eea38c0431e9e8de121a333e156/candies');
      const candies = response.data;

      console.log('Candies API Response:', response.data); // Log the entire API response

      const candyList = document.getElementById("candyList");
      candyList.innerHTML = "";

      candies.forEach((candy, index) => {
          const candyItem = document.createElement("div");
          candyItem.classList.add("candy-item");
          candyItem.innerHTML = `
              <strong>${candy.name || 'Name not available'}</strong> - ${candy.description || 'Description not available'} - Quantity: <span id="quantity-${index}">${candy.quantity || 'Quantity not available'}</span>
              <button onclick="buyOne('${candy._id}')">BuyOne</button>
              <button onclick="buyTwo('${candy._id}')">BuyTwo</button>
              <button onclick="buyThree('${candy._id}')">BuyThree</button>
          `;
          candyList.appendChild(candyItem);
      });

  } catch (error) {
      console.error('Error loading candies:', error);
  }
}


function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("quantity").value = "";
}

async function updateQuantity(candyId, amount) {
  try {
      const response = await axios.get(`https://crudcrud.com/api/221d7eea38c0431e9e8de121a333e156/candies/${candyId}`);
      const candy = response.data;

      if (candy) {
          const newQuantity = Math.max(0, candy.quantity - amount);
          await axios.put(`https://crudcrud.com/api/221d7eea38c0431e9e8de121a333e156/candies/${candyId}`, { quantity: newQuantity });
          loadCandies();
      } else {
          console.error('Candy not found:', candyId);
      }
  } catch (error) {
      console.error('Error updating quantities:', error);
  }
}

async function buyOne(candyId) {
  updateQuantity(candyId, 1);
}

async function buyTwo(candyId) {
  updateQuantity(candyId, 2);
}

async function buyThree(candyId) {
  updateQuantity(candyId, 3);
}
