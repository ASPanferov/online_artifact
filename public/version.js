// Angel Connect Version Information
export const VERSION = {
    number: "1.2.1",
    name: "Icon Fix & Filter Enhancement",
    date: "2025-01-13",
    build: Date.now(),
    features: [
        "Fixed Lucide icons on main site",
        "Fixed startup filtering system",
        "Enhanced CRM modal UX",
        "Added version tracking"
    ],
    changelog: {
        "1.2.1": "Fixed icons and filtering on main site",
        "1.2.0": "Major CRM improvements and enhanced UX",
        "1.1.5": "Security fixes and CORS improvements",
        "1.1.0": "CRM system launch with full functionality", 
        "1.0.0": "Initial Angel Connect website launch"
    }
};

// For non-module environments
if (typeof window !== 'undefined') {
    window.AngelConnectVersion = VERSION;
}