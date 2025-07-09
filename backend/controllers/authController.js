const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// Register a new user
const Signup = async(req , res) => {
    try {
        const { email, password } = req.body;
  const { user } = await supabase.auth.signUp({ email, password });
    res
    .status(201)
    .json({ message: 'Signup successful', user });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ error: "Internal server error" });    
    }
}


// Login
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
      
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        console.log("Login data:", data);
        if (error) {
            return res.status(401).json({ 
                error: error.message || "Authentication failed" 
            });
        }

        if (!data || !data.session) {
            return res.status(401).json({ 
                error: "No session data returned" 
            });
        }

        // Return the complete session data
        return res.status(200).json({
            message: 'Login successful',
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                user: data.session.user,
                expires_at: data.session.expires_at
            }
        });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Logout
const LogOut =  async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          return res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    Signup , 
    Login ,
    LogOut
};
