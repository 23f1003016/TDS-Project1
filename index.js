const axios = require("axios");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");

require("dotenv").config();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
};

const userCsvWriter = createObjectCsvWriter({
  path: "users.csv",
  header: [
    { id: "login", title: "login" },
    { id: "name", title: "name" },
    { id: "company", title: "company" },
    { id: "location", title: "location" },
    { id: "email", title: "email" },
    { id: "hireable", title: "hireable" },
    { id: "bio", title: "bio" },
    { id: "public_repos", title: "public_repos" },
    { id: "followers", title: "followers" },
    { id: "following", title: "following" },
    { id: "created_at", title: "created_at" },
  ],
});

const repoCsvWriter = createObjectCsvWriter({
  path: "repositories.csv",
  header: [
    { id: "login", title: "login" },
    { id: "full_name", title: "full_name" },
    { id: "created_at", title: "created_at" },
    { id: "stargazers_count", title: "stargazers_count" },
    { id: "watchers_count", title: "watchers_count" },
    { id: "language", title: "language" },
    { id: "has_projects", title: "has_projects" },
    { id: "has_wiki", title: "has_wiki" },
    { id: "license_name", title: "license_name" },
  ],
});

async function fetchUsers() {
  const users = [];
  let page = 1;

  while (true) {
    console.log(`Fetching users on page ${page}...`);
    const url = `https://api.github.com/search/users?q=location:Boston+followers:>100&page=${page}&per_page=100`;
    const response = await axios.get(url, { headers });
    console.log(`Fetched ${response.data.items.length} users.`);

    if (response.data.items.length === 0) break;
    users.push(...response.data.items);
    page++;
  }

  console.log(`Total users fetched: ${users.length}`);
  return users;
}

async function fetchUserDetails(user) {
  console.log(`Fetching details for user: ${user.login}`);
  const userDetails = await axios.get(
    `https://api.github.com/users/${user.login}`,
    { headers }
  );

  const cleanedCompany = (userDetails.data.company || "")
    .replace(/^@/, "")
    .trim()
    .toUpperCase();

  console.log(
    `Fetched details for ${user.login}: ${userDetails.data.name || "No Name"}`
  );

  return {
    login: userDetails.data.login,
    name: userDetails.data.name || "",
    company: cleanedCompany,
    location: userDetails.data.location || "",
    email: userDetails.data.email || "",
    hireable: userDetails.data.hireable || "",
    bio: userDetails.data.bio || "",
    public_repos: userDetails.data.public_repos,
    followers: userDetails.data.followers,
    following: userDetails.data.following,
    created_at: userDetails.data.created_at,
  };
}

async function fetchRepositories(user) {
  const repositories = [];
  let page = 1;

  console.log(`Fetching repositories for user: ${user.login}`);
  while (true) {
    const url = `https://api.github.com/users/${user.login}/repos?sort=pushed&page=${page}&per_page=100`;
    const response = await axios.get(url, { headers });

    if (response.data.length === 0) break;

    response.data.forEach((repo) => {
      repositories.push({
        login: user.login,
        full_name: repo.full_name,
        created_at: repo.created_at,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        language: repo.language || "",
        has_projects: repo.has_projects,
        has_wiki: repo.has_wiki,
        license_name: repo.license ? repo.license.key : "",
      });
    });

    console.log(
      `Fetched ${response.data.length} repos on page ${page} for user ${user.login}`
    );
    if (repositories.length >= 500) break;
    page++;
  }

  console.log(
    `Total repositories fetched for ${user.login}: ${repositories.length}`
  );
  return repositories.slice(0, 500); 
}

async function main() {
  console.log("Starting data scraping process...");
  const users = await fetchUsers();
  const userDetails = [];
  const allRepos = [];

  for (const user of users) {
    const details = await fetchUserDetails(user);
    userDetails.push(details);

    const repos = await fetchRepositories(user);
    allRepos.push(...repos);
  }

  console.log("Writing user details to users.csv...");
  await userCsvWriter.writeRecords(userDetails);
  console.log("Writing repositories to repositories.csv...");
  await repoCsvWriter.writeRecords(allRepos);

  console.log("Data successfully written to CSV files.");
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
