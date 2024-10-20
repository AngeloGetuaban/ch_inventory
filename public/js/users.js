document.addEventListener('DOMContentLoaded', async () => {
    const usersTableBody = document.querySelector('#users-table tbody');

    try {
        // Fetch all users from the server
        const response = await fetch('/all-users');
        const data = await response.json();

        // Check if the request was successful
        if (response.ok && data.users) {
            // Loop through the users and create table rows
            data.users.forEach(user => {
                const row = document.createElement('tr');
                
                // Insert the user data into the row
                row.innerHTML = `
                    <td>${user.email}</td>
                    <td>${user.profile.first_name || 'N/A'}</td>
                    <td>${user.profile.last_name || 'N/A'}</td>
                    <td>${user.profile.role_name || 'N/A'}</td>
                    <td>${user.profile.branch_name || 'N/A'}</td>
                    <td class="action-buttons">
                        <button class="btn info-btn">Info</button>
                        <button class="btn edit-btn">Edit</button>
                        <button class="btn delete-btn">Delete</button>
                    </td>
                `;
                
                // Append the row to the table body
                usersTableBody.appendChild(row);
            });
        } else   {
            console.error('Error fetching users:', data.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});

