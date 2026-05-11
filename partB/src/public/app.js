const form = document.querySelector("#shorten-form");
const urlInput = document.querySelector("#url");
const customCodeInput = document.querySelector("#custom-code");
const message = document.querySelector("#message");
const linksList = document.querySelector("#links");

function renderLinks(links) {
  linksList.innerHTML = "";

  for (const link of links) {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    const meta = document.createElement("span");
    const deleteButton = document.createElement("button");

    anchor.href = link.shortUrl;
    anchor.textContent = link.shortUrl;
    anchor.target = "_blank";
    meta.textContent = ` -> ${link.originalUrl} (${link.clicks} clicks, code: ${link.shortCode})`;
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      const response = await fetch(`/api/links/${link.shortCode}`, { method: "DELETE" });

      if (!response.ok) {
        message.textContent = "Could not delete link";
        return;
      }

      message.textContent = "Link deleted";
      await loadLinks();
    });

    item.append(anchor, meta, deleteButton);
    linksList.append(item);
  }
}

async function loadLinks() {
  const response = await fetch("/api/links");
  const data = await response.json();
  renderLinks(data.links);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const response = await fetch("/api/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: urlInput.value,
      customCode: customCodeInput.value
    })
  });
  const data = await response.json();

  if (!response.ok) {
    message.textContent = data.error || "Could not create short URL";
    return;
  }

  urlInput.value = "";
  customCodeInput.value = "";
  message.textContent = `Created ${data.link.shortUrl}`;
  await loadLinks();
});

loadLinks().catch(() => {
  message.textContent = "Could not load links";
});
