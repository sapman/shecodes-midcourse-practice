function uploadFile() {
  let file = document.getElementById("upload").files[0]; // file from input
  let req = new XMLHttpRequest();
  let formData = new FormData();

  formData.append("file", file);
  req.open("POST", "/upload");
  req.send(formData);
  req.addEventListener("load", (res) => {
    confirm(res.currentTarget.response);
    location.reload();
  });
}

window.addEventListener("load", () => {
  let req = new XMLHttpRequest();
  req.open("GET", "/message");
  req.send();
  req.addEventListener("load", (data) => {
    console.log(data);
    document.getElementById("message").innerHTML += data.currentTarget.response;
  });
});

window.addEventListener("load", () => {
  let req = new XMLHttpRequest();
  req.open("GET", "/list");
  req.send();
  req.addEventListener("load", (data) => {
    const items = JSON.parse(data.currentTarget.response);
    const rootElement = document.getElementById("files-list");
    items.forEach((elem) => {
      rootElement.innerHTML += `<li>${elem.Key} Size: ${elem.Size}</li>`;
    });
  });
});
