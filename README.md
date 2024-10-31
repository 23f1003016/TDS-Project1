# GitHub Users Analysis in Boston

- This project analyzes GitHub users from Boston with over 100 followers, utilizing data scraped from the GitHub API using JavaScript and Axios.
- What I discovered was that most users are affiliated with Northeastern University, showcasing the academic influence in the local tech community.
- Developers should enhance their profiles with detailed bios, as longer bios correlate with higher follower counts.

## Process of Analysis

I used **JavaScript** with **Axios** to scrape data from the GitHub API. Here’s a sample code snippet for fetching user data:

```javascript
const axios = require('axios');

async function fetchUsers() {
    const response = await axios.get('https://api.github.com/users?location=Boston&followers=100');
    return response.data;
}
```

Data was stored in `users.csv` and `repositories.csv`, capturing key details like user logins, follower counts, and repository information.

For analysis, I utilized **Google Colab** with the following Python libraries:

- **Pandas**: For data manipulation.
- **NumPy**: For numerical operations.
- **Matplotlib** and **Seaborn**: For data visualization.

Key questions addressed user engagement, repository statistics, and language patterns, yielding valuable insights.
Notebook is added to this repository - TDS_Project1.ipynb

## Key Findings

1. **Top Users**: Identified top five users with the highest followers.
2. **Early Registrants**: Discovered the earliest registered users, reflecting community growth.
3. **License Popularity**: Analyzed popular licenses to understand open-source trends.
4. **Company Affiliation**: Noted the prevalence of users from Northeastern University.
5. **Language Trends**: Found the most popular programming languages used.

## Recommendations

Developers should:

- Enhance bios to improve follower engagement.
- Engage with trending programming languages and contribute to open-source projects for increased visibility.

## Conclusion

This analysis provides insights into the Boston GitHub community, offering trends and recommendations for developers to optimize their profiles and enhance collaboration.
