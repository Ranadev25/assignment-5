const allbtn = document.getElementById("allbtn");
const activeButtons = document.querySelectorAll(".button");
const cardContent = document.getElementById("card-content");
const searchBtn = document.getElementById("searchBtn");
const search = document.getElementById("search");
const total = document.getElementById("total");

let openData = [];
let closedData = [];
let allData = [];
let searchData = [];

window.addEventListener("DOMContentLoaded", () => {
  loadingSpinner(true);
  allDataFetching();
  total.innerHTML = allData.length;
});

searchBtn.addEventListener("click", () => {
  const inputValue = search.value.toLowerCase();
  const searchingData = allData.filter((item) => {
    return (
      item.title.toLowerCase().includes(inputValue) ||
      item.description.toLowerCase().includes(inputValue)
    );
  });
  searchData = searchingData;
  activeButtons.forEach((btns) => {
    btns.classList.remove("active");
  });
  handelRenderData(searchingData);
  total.innerHTML = searchData.length;
});

const allDataFetching = async () => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues`;
  loadingSpinner(true);
  const res = await fetch(url);
  const data = await res.json();
  allData = data.data;
  handelRenderData(allData, "all");
  renderIssues(allData);
  total.innerHTML = allData.length;
};

const renderIssues = (data) => {
  activeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeButtons.forEach((btns) => {
        btns.classList.remove("active");
      });
      btn.classList.add("active");
      if (btn.value === "All") {
        handelRenderData(data, "all");
        total.innerHTML = allData.length;
        return;
      } else if (btn.value === "Open") {
        const filtering = data.filter((item) => item.status === "open");

        openData = filtering;
        handelRenderData(filtering, "open");
        total.innerHTML = filtering.length;
      } else if (btn.value === "Closed") {
        const filtering = data.filter((item) => item.status === "closed");
        closedData = filtering;
        handelRenderData(filtering, "closed");
        total.innerHTML = filtering.length;
      }
    });
  });
};

const handelRenderData = (data) => {
  cardContent.innerHTML = "";

  data.forEach((item) => {
    const borderTop =
      item.status === "open" ? "border-green-400" : "border-purple-400";

    const priorityColor =
      item.priority === "high"
        ? "text-red-600 bg-red-50"
        : item.priority === "medium"
          ? "text-yellow-500 bg-yellow-50"
          : "text-purple-600 bg-purple-50";

    const statusImage =
      item.status.toLowerCase() === "open"
        ? "./assets/Open-Status.png"
        : "./assets/closed.png";

    const statusBg =
      item.status.toLowerCase() === "open"
        ? "bg-green-50 "
        : "bg-purple-50 text-purple-500";

    const div = document.createElement("div");
    div.innerHTML = `
    <div class="bg-[#fff] rounded-md border-t-[5px] ${borderTop} cursor-pointer " onclick="showModalById(${item.id})">
            <div class="p-4 ">
              <div class="flex justify-between items-center">
                <div class="${statusBg} max-w-6 p-0.5 rounded-full">
                <img class="" src="${statusImage}" alt="" />
                </div>

                <p class=" text-sm px-5 py-0.5 rounded-full ${priorityColor}">${item.priority.toUpperCase()}</p>
              </div>
              <h1 class="font-semibold my-3">${item.title}</h1>
              <p class="text-sm mb-3 text-[#64748B]">
                ${item.description}
              </p>
              <div class="flex gap-5 ">
                <div class="flex gap-1 justify-start items-center  border px-1  rounded-full text-red-500 bg-red-50">
                  <i class=" w-4 fa-solid fa-bug"></i>
                  <h1 class="text-sm">${item.labels[0]}</h1>
                </div>
                <div class="flex gap-1 justify-start items-center text-yellow-400 border px-1  rounded-full bg-red-50 ${item.labels[1] ? "flex" : "hidden"} ">
                  <i class="w-4  fa-solid fa-life-ring"></i>
                  <h1 class="text-sm">${item.labels[1] ? item.labels[1] : ""}</h1>
                </div>
              </div>
            </div>
            <div class="border-t-2 border-gray-200 mt-3 p-5 text-[#64748B] text-sm">
              <p>01 by john_doe</p>
              <data>1/15/2024</data>
            </div>
          </div>
      
    `;
    cardContent.appendChild(div);
  });
  loadingSpinner(false);
};

const loadingSpinner = (status) => {
  if (status == true) {
    document.getElementById("loading").classList.remove("hidden");
    cardContent.classList.remove("p-5");
  } else {
    document.getElementById("loading").classList.add("hidden");
    cardContent.classList.add("p-5");
  }
};

const showModalById = async (id) => {
  try {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

    const res = await fetch(url);
    const data = await res.json();
    showModels(data.data);
  } catch (error) {
    console.log(error);
  }
};

const showModels = (item) => {
  const issueContainer = document.getElementById("issue-container");
  issueContainer.innerHTML = "";
  const card = document.createElement("div");
  
  card.innerHTML = `
  <div class="bg-white ">
        <div>
          <h1 class="font-semibold text-xl">${item.title}</h1>

          <div>
            <p class="my-3 text-[#64748B]">
              <span class="text-white bg-primary rounded-full px-2 py-0.5">${item.status}</span>
              +
              <span>${item.author? item.author : "john_doe"} </span>
              <span> + </span>
              ${new Date(item.createdAt).toISOString().slice(0, 10)}
            </p>
          </div>

          <div class="my-7">
            <div class="flex gap-5">
              <div
                class="flex gap-1 justify-start items-center border px-1 rounded-full text-red-500 bg-red-50"
              >
                <i class="w-4 fa-solid fa-bug"></i>
                <h1 class="text-sm">${item.labels[0]}</h1>
              </div>
              <div
                class="flex gap-1 justify-start items-center text-yellow-400 border px-1 rounded-full bg-red-50 ${item.labels[1] ? "flex" : "hidden"} "
              >
                <i class="w-4 fa-solid fa-life-ring"></i>
                <h1 class="text-sm">${item.labels[1] ? item.labels[1] : ""}</h1>
              </div>
            </div>
          </div>
          <p class="text-sm text-[#64748B]">${item.description}</p>

          <div class="bg-blue-50 rounded-md p-3 flex  gap-[40%] mt-5">
            <div>
              <p class="text-[#64748B]">Assignee:</p>
              <h1 class="font-semibold">${item.assignee? item.assignee : "Fahim Ahmed"}</h1>
            </div>
            <div>
              <p class="text-[#64748B]">Priority:</p>
              <p class="bg-red-400 text-center rounded-full mt-1 px-2">${item.priority? item.priority.toUpperCase() : "HIGH"}</p>
            </div>
          </div>
        </div>
      </div>
  
  `;
  issueContainer.appendChild(card);
  document.getElementById("issue_modal").showModal();
};
