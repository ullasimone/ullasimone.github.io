const jwtToken = localStorage.getItem("jwtToken"); // You need to store the token in localStorage in the login function

const graphqlEndpoint = "https://01.kood.tech/api/graphql-engine/v1/graphql"; 
const query = `
  query {
    user{
      auditRatio
      login
      id
      transactions(where:{_or:[{type:{_eq:"xp"}},{type:{_eq:"level"}},{type:{_regex:"skill"}}]}){
        type
        amount
        path
        eventId
        createdAt
        
        object{
          updatedAt
          name
          type 	
        }
      }
      
    }
  }

  `;

// Perform the GraphQL query with Bearer authentication
fetch(graphqlEndpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    if (data.errors) {
      throw new Error("GraphQL query returned errors");
    }

    const userDiv = document.getElementById("userLogin");
    userDiv.textContent = data.data.user[0].login; // Display the GraphQL schema

    console.log("User:", data);

    const transactionProjectsDiv = document.getElementById(
      "transactionProjects"
    );
    const transactionExercisesDiv = document.getElementById(
      "transactionExercises"
    );
    const totalXpDiv = document.getElementById("totalXp");
    const projectsXpDiv = document.getElementById("projectsXp");
    const exercisesXpDiv = document.getElementById("exercisesXp");
    const userLevelDiv = document.getElementById("userLevel");
    const auditRatioDiv = document.getElementById("auditRatio");
    const allSkillsDiv = document.getElementById("allSkills");
    // Separate transactions based on type into two arrays
    const xpGraphInfo = [];
    const transactionProjects = [];
    const transactionExercises = [];
    const modifiedSkillAmounts = {};
    const skillOrder = ["go", "html", "js", "game", "algo"];
    const skillAmounts = [];
    let projectsXp = 0;
    let exercisesXp = 0;
    let totalXp = 0;
    let level = 0;
    console.log(data.data);
    data.data.user[0].transactions.forEach((transaction) => {
      if (transaction.type === "level") {
        if (transaction.amount && transaction.amount > level) {
          // Check if the transaction is of type "level" and has a valid amount higher than the current highest level amount
          level = transaction.amount;
        }
      } else if (transaction.type === "xp") {
        if (transaction.eventId === 20) {
          xpGraphInfo.push({
            date: transaction.createdAt,
            xp: transaction.amount,
          });
          projectsXp = projectsXp + transaction.amount;
          transactionProjects.push(
            transaction.object.name,
            "\nxp:",
            transaction.amount,
            "\n\n"
          );
        } else if (transaction.object.type === "exercise") {
          exercisesXp += transaction.amount;
          transactionExercises.push(
            transaction.object.name,
            "\nxp:",
            transaction.amount,
            "\n\n"
          );
        }
      }
    });
    // Filter transactions with types containing the keyword "skill"
    const skillTransactions = data.data.user[0].transactions.filter(
      (transaction) => {
        return transaction.type.includes("skill");
      }
    );

    skillTransactions.forEach((transaction) => {
      const skillName = transaction.type;
      const amount = transaction.amount;
      skillAmounts[skillName] = amount;
    });

    for (const skill in skillAmounts) {
      const modifiedSkillName = skill.replace(/^skill_/, "").replace(/-/g, " ");
      const modifiedAmount = `${skillAmounts[skill]}%`;
      modifiedSkillAmounts[modifiedSkillName] = modifiedAmount;
    }

    console.log(modifiedSkillAmounts);
    const skillAmountsArray = skillOrder.map(
      (skill) => skillAmounts[`skill_${skill}`] || 0
    );
    for (const skill in skillAmounts) {
      const modifiedSkillName = skill.replace(/^skill_/, '').replace(/-/g, ' ');
      const modifiedAmount = `${skillAmounts[skill]}%`;
      modifiedSkillAmounts[modifiedSkillName] = modifiedAmount;
    }
    let skillsHTML = '';
for (const skillName in modifiedSkillAmounts) {
  const skillAmount = modifiedSkillAmounts[skillName];
  skillsHTML += `<p>${skillName}: ${skillAmount}</p>`;
}
    console.log("Latest Skill amounts array", skillAmountsArray);
    console.log("All skills", skillAmounts);

    localStorage.setItem(
      "skillAmountsArray",
      JSON.stringify(skillAmountsArray)
    );
    localStorage.setItem(
      "xpGraphInfo",
      JSON.stringify(xpGraphInfo)
    );
    console.log("xpgraphinfo", xpGraphInfo);

    // Display data in the corresponding elements
    userDiv.textContent = data.data.user[0].login;
    transactionProjectsDiv.textContent = transactionProjects.join("");
    transactionExercisesDiv.textContent = transactionExercises.join("");
    allSkillsDiv.innerHTML = skillsHTML;
    projectsXpDiv.textContent = `Projects Total XP: ${Math.round(projectsXp)}`;
    exercisesXpDiv.textContent = `Exercises Total XP: ${Math.round(exercisesXp)}`;
    totalXp = projectsXp + exercisesXp;
    totalXpDiv.textContent = `User's total XP: ${Math.round(totalXp)}`;
    userLevelDiv.textContent = `User level : ${level}`;
    auditRatioDiv.textContent = `Audit ratio : ${
      Math.round(data.data.user[0].auditRatio * 100) / 100
    }`;
  })
  .catch((error) => {
    console.error("Error:", error);
    // Handle GraphQL query errors here
  });
// Function to handle logout
function logout() {
  // Delete the JWT token from local storage
  localStorage.removeItem("jwtToken");
  // Redirect the user to the login page
  window.location.href = "index.html";
}

// Add event listener to the logout button
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", logout);
