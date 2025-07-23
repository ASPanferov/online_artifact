/**
 * Firebase Configuration for AI Hackathon Samarkand
 * Simple integration for form submissions
 */

// Firebase configuration (replace with actual config from Firebase Console)
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Firebase SDK imports (use CDN in HTML)
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

class FirebaseService {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.init();
    }
    
    init() {
        try {
            // Initialize Firebase only if not already initialized
            if (typeof firebase !== 'undefined' && !firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
                this.db = firebase.firestore();
                this.initialized = true;
                console.log('✅ Firebase initialized successfully');
            } else if (firebase.apps.length > 0) {
                this.db = firebase.firestore();
                this.initialized = true;
                console.log('✅ Firebase already initialized');
            }
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            this.initialized = false;
        }
    }
    
    /**
     * Submit hackathon registration
     * @param {Object} data - Registration form data
     * @returns {Promise} - Firebase document reference
     */
    async submitRegistration(data) {
        if (!this.initialized) {
            throw new Error('Firebase not initialized');
        }
        
        try {
            // Add timestamp and generate ID
            const registrationData = {
                ...data,
                submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending',
                source: 'hackathon_website',
                hackathon: 'samarkand_ai_2025'
            };
            
            // Submit to Firestore
            const docRef = await this.db
                .collection('samarkand_hackathon_applications')
                .add(registrationData);
            
            console.log('✅ Registration submitted with ID:', docRef.id);
            
            // Send notification email (if Cloud Functions are set up)
            await this.sendNotificationEmail(registrationData, docRef.id);
            
            return {
                success: true,
                id: docRef.id,
                message: 'Registration submitted successfully'
            };
            
        } catch (error) {
            console.error('❌ Registration submission error:', error);
            throw new Error('Failed to submit registration: ' + error.message);
        }
    }
    
    /**
     * Send notification email via Cloud Function
     * @param {Object} data - Registration data
     * @param {string} documentId - Firestore document ID
     */
    async sendNotificationEmail(data, documentId) {
        try {
            // This would call a Cloud Function to send emails
            // For demo purposes, we'll just log
            console.log('📧 Email notification would be sent for:', {
                email: data.email,
                name: data.fullName,
                documentId: documentId
            });
            
            // Example Cloud Function call:
            /*
            const emailFunction = firebase.functions().httpsCallable('sendRegistrationEmail');
            await emailFunction({
                email: data.email,
                name: data.fullName,
                language: data.language,
                documentId: documentId
            });
            */
            
        } catch (error) {
            console.warn('⚠️ Email notification failed:', error);
            // Don't throw error - registration should still succeed
        }
    }
    
    /**
     * Subscribe to newsletter
     * @param {string} email - Email address
     * @param {string} language - User language preference
     */
    async subscribeNewsletter(email, language = 'ru') {
        if (!this.initialized) {
            throw new Error('Firebase not initialized');
        }
        
        try {
            const subscriptionData = {
                email: email,
                language: language,
                source: 'hackathon_website',
                subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
                active: true
            };
            
            // Use email as document ID to prevent duplicates
            await this.db
                .collection('newsletter_subscriptions')
                .doc(email)
                .set(subscriptionData, { merge: true });
            
            console.log('✅ Newsletter subscription added:', email);
            
            return {
                success: true,
                message: 'Successfully subscribed to newsletter'
            };
            
        } catch (error) {
            console.error('❌ Newsletter subscription error:', error);
            throw new Error('Failed to subscribe to newsletter: ' + error.message);
        }
    }
    
    /**
     * Get hackathon statistics
     * @returns {Object} - Statistics data
     */
    async getHackathonStats() {
        if (!this.initialized) {
            return {
                applications: 0,
                countries: 0,
                teams: 0
            };
        }
        
        try {
            const snapshot = await this.db
                .collection('samarkand_hackathon_applications')
                .get();
            
            const applications = snapshot.size;
            const countries = new Set();
            const teams = new Set();
            
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.country) countries.add(data.country);
                if (data.teamName) teams.add(data.teamName);
            });
            
            return {
                applications: applications,
                countries: countries.size,
                teams: teams.size
            };
            
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
            return {
                applications: 0,
                countries: 0,
                teams: 0
            };
        }
    }
    
    /**
     * Check if user already applied
     * @param {string} email - User email
     * @returns {boolean} - Whether user already applied
     */
    async checkExistingApplication(email) {
        if (!this.initialized) {
            return false;
        }
        
        try {
            const snapshot = await this.db
                .collection('samarkand_hackathon_applications')
                .where('email', '==', email)
                .limit(1)
                .get();
            
            return !snapshot.empty;
            
        } catch (error) {
            console.error('❌ Error checking existing application:', error);
            return false;
        }
    }
}

// Create global instance
window.firebaseService = new FirebaseService();

/**
 * Utility function to initialize Firebase with HTML script tags
 * Call this if you want to initialize Firebase manually
 */
window.initializeFirebaseForHackathon = function() {
    // Add Firebase scripts dynamically if not already loaded
    if (typeof firebase === 'undefined') {
        const script1 = document.createElement('script');
        script1.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
        script1.onload = () => {
            const script2 = document.createElement('script');
            script2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
            script2.onload = () => {
                window.firebaseService = new FirebaseService();
            };
            document.head.appendChild(script2);
        };
        document.head.appendChild(script1);
    } else {
        window.firebaseService = new FirebaseService();
    }
};

/**
 * Mock Firebase service for development/testing
 * Use this when Firebase is not available
 */
class MockFirebaseService {
    constructor() {
        this.initialized = true;
        console.log('🔧 Using Mock Firebase Service for development');
    }
    
    async submitRegistration(data) {
        // Simulate network delay
        await this.delay(1500);
        
        // Simulate random success/failure for testing
        if (Math.random() > 0.1) { // 90% success rate
            const id = 'mock_' + Date.now();
            console.log('✅ Mock registration submitted:', { id, data });
            return {
                success: true,
                id: id,
                message: 'Registration submitted successfully (mock)'
            };
        } else {
            throw new Error('Mock registration failed for testing');
        }
    }
    
    async subscribeNewsletter(email, language) {
        await this.delay(800);
        console.log('✅ Mock newsletter subscription:', { email, language });
        return {
            success: true,
            message: 'Successfully subscribed to newsletter (mock)'
        };
    }
    
    async getHackathonStats() {
        await this.delay(500);
        return {
            applications: Math.floor(Math.random() * 50) + 20,
            countries: Math.floor(Math.random() * 10) + 5,
            teams: Math.floor(Math.random() * 15) + 8
        };
    }
    
    async checkExistingApplication(email) {
        await this.delay(300);
        // Simulate some emails already existing
        return ['test@example.com', 'demo@test.com'].includes(email);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Use mock service if Firebase is not available
if (typeof firebase === 'undefined') {
    console.warn('⚠️ Firebase not detected, using mock service');
    window.firebaseService = new MockFirebaseService();
}

// Enhanced form submission for hackathon site
if (window.hackathonSite) {
    // Override the submitToFirebase method in the main script
    window.hackathonSite.submitToFirebase = async function(data) {
        return await window.firebaseService.submitRegistration(data);
    };
}

// Export for use in other scripts
window.FirebaseService = FirebaseService;
window.MockFirebaseService = MockFirebaseService;