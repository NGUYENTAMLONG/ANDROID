const renderTopicsDiv = document.querySelector(".renderTopics");

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
btnStart.addEventListener("click", function () {
  //   event.preventDefault();
  checkRadios.forEach((item, index) => {
    if (item.checked === true) {
      console.log(item.value);
    }
  });
});
