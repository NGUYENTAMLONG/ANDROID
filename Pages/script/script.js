const renderTopicsDiv = document.querySelector(".renderTopics");
const tagUsername = document.querySelector(".username");
const userName = window.location.href.split("user=")[1];
const divUser = document.querySelector(".user");
console.log(typeof userName);
if (typeof userName === "undefined") {
  divUser.innerHTML = `
  <a href="login.html" class="text-light" style="text-decoration:none"><i class="fa fa-sign-in" aria-hidden="true"></i> Đăng Nhập </a>
  / <a href="register.html" class="text-light" style="text-decoration:none"><i class="fa fa-registered" aria-hidden="true"></i> Đăng ký`;
} else {
  tagUsername.innerHTML = userName;
}

fetch("https://onlinequiz-app-ver1.herokuapp.com/api/question/")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    const topics = Array.from(new Set(data.map((item, index) => item.topic))); //Xóa phần tử trùng lặp rồi gán cho mảng mới
    renderTopics(topics);
  })
  .catch((error) => console.log(error));

function renderTopics(topics) {
  let htmls = topics.map((topic, index) => {
    return `
      <div class="form-check">
      <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios${index}" value="${topic}" checked>
      <label class="form-check-label" for="gridRadios${index}">
        ${topic}
      </label>
      </div>
      `;
  });
  renderTopicsDiv.innerHTML = htmls.join("");
}

const btnStart = document.querySelector(".btnStart");
const checkRadios = document.querySelectorAll(".form-check-input");

localStorage.setItem("username", userName);
btnStart.addEventListener("click", function (e) {
  // e.preventDefault();
  if (typeof userName === "undefined") {
    let text = "You must login with your account !";
    e.preventDefault();
    if (confirm(text) == true) {
      location.assign("http://127.0.0.1:5501/Pages/login.html");
    } else {
      return;
    }
  } else {
  }
  checkRadios.forEach((item, index) => {
    if (item.checked === true) {
      console.log(item.value);
    }
  });
});
