const signIn = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === "admin" && password === "admin123") {
    window.location.href = "index.html";
  } else {
    alert("Invalid username or password");
  }
};

let allIssuesData = [];
let currentFilter = "all";
let filterTimeout;

const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const issueContainer = document.getElementById("issue-container");
const totalIssuesElement = document.getElementById("total-issues");
const searchInput = document.getElementById("searchInput");

const btnAll = document.getElementById("btn-all");
const btnOpen = document.getElementById("btn-open");
const btnClosed = document.getElementById("btn-closed");

issueContainer.innerHTML =
  '<div class="col-span-full w-full flex justify-center items-center py-20"><span class="loading loading-bars loading-xl text-[#4A00FF]"></span></div>';

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    allIssuesData = data.data;
    setActiveButton(btnAll);
    applyFilters();
  });

function applyFilters() {
  issueContainer.innerHTML =
    '<div class="col-span-full w-full flex justify-center items-center py-20"><span class="loading loading-bars loading-xl text-[#4A00FF]"></span></div>';

  clearTimeout(filterTimeout);

  filterTimeout = setTimeout(() => {
    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const filteredIssues = allIssuesData.filter((issue) => {
      const searchableText =
        `${issue.title} ${issue.description} ${issue.author}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm);

      if (searchTerm !== "") {
        return matchesSearch;
      }

      const matchesTab =
        currentFilter === "all" || issue.status.toLowerCase() === currentFilter;
      return matchesTab;
    });

    renderIssues(filteredIssues);
  }, 400);
}

function renderIssues(issues) {
  issueContainer.innerHTML = "";

  if (totalIssuesElement) {
    totalIssuesElement.textContent =
      issues.length === 1 ? "1 Issue" : `${issues.length} Issues`;
  }

  issues.forEach((issue) => {
    const statusImg =
      issue.status === "open"
        ? "../assets/open-status.png"
        : "../assets/closed-status.png";
    const borderTopColor =
      issue.status === "open" ? "border-t-[#00A96E]" : "border-t-[#8250df]";

    const card = document.createElement("div");
    card.innerHTML = `
      <label for="my_modal_6" class="cursor-pointer h-full block">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 border-t-4 ${borderTopColor} hover:shadow-md transition-all flex flex-col h-[340px]">
          
          <div class="flex justify-between items-start p-5">
            <img class="w-5 h-5 object-contain" src="${statusImg}" alt="${issue.status}" />
            <div class="px-3 py-1 rounded-full ${getPriorityStyles(issue.priority)}">
                <span class="text-[10px] font-bold tracking-wider uppercase">${issue.priority}</span>
            </div>
          </div>

          <div class="px-5">
            <h2 class="text-[15px] font-bold text-gray-900 leading-snug text-left line-clamp-2">
              ${issue.title}
            </h2>
          </div>

          <p class="text-xs mt-3 px-5 text-gray-500 text-left line-clamp-2 leading-relaxed">
            ${issue.description}
          </p>

          <div class="px-5 mt-4 flex flex-wrap gap-2">
            ${issue.labels
              .map(
                (label) => `
              <div class="border ${getLabelStyle(label)} text-[10px] font-semibold rounded-full px-2.5 py-1 flex items-center gap-1">
                ${getLabelIcon(label)} ${label.toUpperCase()}
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="mt-auto">
            <div class="border-t border-gray-100 mx-5"></div>
            <div class="px-5 py-4 flex flex-col gap-1 text-[11px] text-gray-400 text-left">
              <span class="font-medium text-gray-500">#${issue.id} by ${issue.author}</span>
              <span>${issue.createdAt}</span>
            </div>
          </div>

        </div>
      </label>
    `;
    issueContainer.appendChild(card);
  });
}

function setActiveButton(activeBtn) {
  if (!btnAll || !btnOpen || !btnClosed) return;

  [btnAll, btnOpen, btnClosed].forEach((btn) => {
    btn.className =
      "btn w-[120px] bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors";
  });

  activeBtn.className =
    "btn w-[120px] bg-[#4A00FF] text-white border border-transparent hover:bg-[#4A00FF]/90 transition-colors";
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (btnAll && btnOpen && btnClosed) {
  btnAll.addEventListener("click", () => {
    currentFilter = "all";
    setActiveButton(btnAll);
    applyFilters();
  });

  btnOpen.addEventListener("click", () => {
    currentFilter = "open";
    setActiveButton(btnOpen);
    applyFilters();
  });

  btnClosed.addEventListener("click", () => {
    currentFilter = "closed";
    setActiveButton(btnClosed);
    applyFilters();
  });
}

const getPriorityStyles = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-500";
    case "medium":
      return "bg-yellow-50 text-yellow-600";
    case "low":
      return "bg-gray-100 text-gray-500";
    default:
      return "bg-blue-50 text-blue-500";
  }
};

const getLabelStyle = (label) => {
  const l = label.toLowerCase();
  if (l.includes("bug")) return "text-red-500 border-red-200 bg-[#FEECEC]";
  if (l.includes("help") || l.includes("wanted"))
    return "text-yellow-600 border-yellow-200 bg-[#FFF8DB]";
  if (l.includes("enhancement"))
    return "text-green-500 border-green-500 bg-[#BBF7D0]";
  return "text-gray-500 border-gray-200 bg-transparent";
};

const getLabelIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes("bug")) return `<i class="fa-solid fa-bug"></i>`;
  if (l.includes("help") || l.includes("wanted"))
    return `<i class="fa-regular fa-life-ring"></i>`;
  return ``;
};
