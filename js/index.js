document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.querySelector("#list");
    const showPanel = document.querySelector("#show-panel");

    // Get list of books from API and display them
    fetch("http://localhost:3000/books")
      .then(resp => resp.json())
      .then(data => {
        data.forEach(book => {
          const li = document.createElement("li");
          li.innerText = book.title;
          li.addEventListener("click", () => showBookDetails(book));
          listPanel.appendChild(li);
        });
      });

    // Display book details when a book title is clicked
    function showBookDetails(book) {
      showPanel.innerHTML = `
        <img src="${book.img_url}">
        <h2>${book.title}</h2>
        <h3>${book.subtitle}</h3>
        <p>${book.description}</p>
        <button data-bookid="${book.id}">${book.users.find(user => user.id === 1) ? "UNLIKE" : "LIKE"}</button>
        <ul>${book.users.map(user => `<li>${user.username}</li>`).join("")}</ul>
      `;
      showPanel.querySelector("button").addEventListener("click", () => handleLikeButtonClick(book));
    }

    // Handle click of LIKE/UNLIKE button
    function handleLikeButtonClick(book) {
      const user = {"id":1, "username":"pouros"};
      const isLikedByUser = book.users.find(user => user.id === 1);

      if (isLikedByUser) {
        // Remove user from list of likes
        const updatedUsers = book.users.filter(user => user.id !== 1);
        sendPatchRequest(book.id, updatedUsers);
        showPanel.querySelector("button").innerText = "LIKE";
        showPanel.querySelector("ul").innerHTML = updatedUsers.map(user => `<li>${user.username}</li>`).join("");
      } else {
        // Add user to list of likes
        const updatedUsers = [...book.users, user];
        sendPatchRequest(book.id, updatedUsers);
        showPanel.querySelector("button").innerText = "UNLIKE";
        showPanel.querySelector("ul").innerHTML += `<li>${user.username}</li>`;
      }
    }

    // Send PATCH request to API to update book's list of likes
    function sendPatchRequest(bookId, updatedUsers) {
      fetch(`http://localhost:3000/books/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ users: updatedUsers })
      })
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
  });
