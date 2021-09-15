const toCurrency = (price) => {
  return new Intl.NumberFormat("tm-TM", {
    currency: "tmt",
    style: "currency",
  }).format(price);
};
document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
  $card.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;
      console.log(id);
      fetch("/card/remove/" + id, {
        method: "delete",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      })
        .then((res) => res.json())
        .then((card) => {
          if (!card.courses.length) {
            $card.innerHTML = "<p>Card is empty</p>";
          } else {
            const data = card.courses
              .map((c) => {
                return `<tr>
                        <td>${c.title}</td>
                        <td>${c.count}</td>
                        <td>
                            <button class="btn btn-small js-remove" data-id="${c.id}"  data-csrf="${csrf}">
                                Delete
                            </button>
                        </td>
                    </tr>`;
              })
              .join("");
            $card.querySelector("tbody").innerHTML = data;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          }
        });
    }
  });
}

M.Tabs.init(document.querySelectorAll(".tabs"));
