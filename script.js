// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuSKstc9p_nhqLrqZKY_VHsr8pISLlKTY",
    authDomain: "financeportal-63336.firebaseapp.com",
    projectId: "financeportal-63336",
    storageBucket: "financeportal-63336.firebasestorage.app",
    messagingSenderId: "503084246152",
    appId: "1:503084246152:web:1c254a1d032e15655aab3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Event listener for form submission
document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get user input values (trimmed for safety)
    const name = document.getElementById("name").value.trim();
    const accountNumber = document.getElementById("accountNumber").value.trim();

    console.log("🔍 Fetching transactions for:", name, accountNumber);

    try {
        // 🔥 Firestore Query (Corrected Field Names)
        const q = query(collection(db, "transactions"), 
                        where("Name", "==", name),  
                        where("AccountNumber", "==", accountNumber));

        const querySnapshot = await getDocs(q);

        console.log(`✅ Found ${querySnapshot.size} transactions.`);

        let transactions = [];
        querySnapshot.forEach(doc => {
            console.log("📄 Transaction Data:", doc.data());
            transactions.push(doc.data());
        });

        // Display transactions in passbook format
        displayTransactions(transactions);
    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        alert("Error fetching transactions. Check console for details.");
    }
});

// Function to display transactions in a passbook format
function displayTransactions(transactions) {
    const transactionSection = document.getElementById("transactionSection");
    transactionSection.classList.remove("hidden");

    const transactionBody = document.getElementById("transactionBody");
    transactionBody.innerHTML = ""; // Clear previous results

    if (transactions.length === 0) {
        transactionBody.innerHTML = `<tr><td colspan="4">No transactions found.</td></tr>`;
        return;
    }

    transactions.forEach(txn => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formatDate(txn.date)}</td>
            <td>${txn.description}</td>
            <td class="${txn.type === 'Credit' ? 'credit' : 'debit'}">
                ₹${txn.amount.toLocaleString()} 
            </td>
            <td class="${txn.type === 'Credit' ? 'credit' : 'debit'}">${txn.type}</td>
        `;
        transactionBody.appendChild(row);
    });
}

// Function to format date to DD-MM-YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // If invalid, return as is
    return date.toLocaleDateString('en-GB'); // Formats to DD/MM/YYYY
}

// Event listener for print button
document.getElementById("printBtn").addEventListener("click", () => window.print());
