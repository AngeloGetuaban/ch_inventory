const express = require('express');
const router = express.Router();

// Route that uses the Supabase client
router.get('/', async (req, res) => {
    const user = req.session.user;
    try {
        if(user){
            res.render('dashboard', { user });
        } else {
            res.render('login');
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.post('/logout', async (req, res) => {
    try {
        // Log out the Supabase user
        const { error } = await req.supabase.auth.signOut();

        if (error) {
            console.error('Error logging out from Supabase:', error.message);
            return res.status(500).send('Error logging out from Supabase');
        }

        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Error logging out');
            }

            // Redirect to login page after successful logout
            res.redirect('/');
        });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).send('Server error during logout');
    }       
});

// POST route to handle login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Use req.supabase to access the Supabase client for authentication
        const { data: authData, error: authError } = await req.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            console.error('Error authenticating:', authError.message);
            res.status(401).send('Invalid email or password');
            return;
        }

        // Get the authenticated user's uid (dynamic)
        const userId = authData.user.id;

        // Fetch the user profile from the user_profiles table using the authenticated user's uid
        const { data: profileData, error: profileError } = await req.supabase
            .from('user_profiles')
            .select('*')
            .eq('auth_id', userId)  // Use userId dynamically
            .single(); // Assuming each user has one profile record

        if (profileError) {
            console.error('Error fetching user profile:', profileError.message);
            res.status(500).send('Error fetching user profile');
            return;
        }

        // Store both the user authentication data and profile data in the session
        req.session.user = {
            auth: authData.user,  // Data from the authentication
            profile: profileData  // Data from the user_profiles table
        };

        // Redirect to the dashboard after successful login
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});



router.get('/dashboard', (req, res) => {
    const user = req.session.user;
    if (user) {
        res.render('dashboard', { auth: user.auth, profile: user.profile });
    } else {
        res.redirect('/');
    }
});

router.get('/users', (req, res) => {
    const user = req.session.user;
    if (user) {
        res.render('users', { auth: user.auth, profile: user.profile });
    } else {
        res.redirect('/');
    }
});

// Fetch all users route (ensure this is secure and restricted to admins)
router.get('/all-users', async (req, res) => {
    const user = req.session.user;
    if(user){
        
        try {
            // Fetch all users from Supabase auth.users using the service role key
            const { data: usersData, error: usersError } = await req.supabase.auth.admin.listUsers();
    
            if (usersError) {
                console.error('Error fetching users:', usersError.message);
                return res.status(500).json({ error: 'Error fetching users' });
            }
    
            // Extract user IDs (uids) from the fetched users
            const uids = usersData.users.map(user => user.id);
    
            // Fetch the corresponding profiles from the user_profiles table using uids
            const { data: profilesData, error: profilesError } = await req.supabase
                .from('user_profiles')
                .select('*')
                .in('auth_id', uids); // Fetch all profiles matching the uids
    
            if (profilesError) {
                console.error('Error fetching user profiles:', profilesError.message);
                return res.status(500).json({ error: 'Error fetching user profiles' });
            }
    
            // Combine auth data with profile data by matching uids
            const usersWithProfiles = usersData.users.map(authUser => {
                const profile = profilesData.find(p => p.auth_id === authUser.id) || {}; // Find matching profile or use empty object
                return {
                    ...authUser,
                    profile, // Include profile data
                };
            });
    
            // Send the combined users and profiles as JSON response
            res.json({ users: usersWithProfiles });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ error: 'Server error during fetching users' });
        }
    } else{
        res.redirect('/');
    }

});


module.exports = router;
