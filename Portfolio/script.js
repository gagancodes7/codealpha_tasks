// Function to handle the API call with exponential backoff
async function callGeminiApi(prompt, retries = 3, delay = 1000) {
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const result = await response.json();
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    return result.candidates[0].content.parts[0].text;
                }
            }
        } catch (error) {
            console.error("API call failed, retrying...", error);
        }
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
    }
    return "Failed to generate a new description. Please try again later.";
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu after clicking a link
        if (mobileMenu.classList.contains('flex')) {
            mobileMenu.classList.remove('flex');
            mobileMenu.classList.add('hidden');
        }
    });
});

// Mobile menu toggle
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');
menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
});

// Scroll-to-top button functionality
const scrollToTopBtn = document.getElementById('scroll-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove('hidden');
    } else {
        scrollToTopBtn.classList.add('hidden');
    }
});
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for fade-in animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});


// Gemini API integration for generating project descriptions
const generateDescriptionButtons = document.querySelectorAll('.generate-description-btn');
generateDescriptionButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const projectCard = button.closest('.bg-white');
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        const projectDescriptionElement = projectCard.querySelector('.project-description');
        const currentDescription = projectDescriptionElement.textContent;

        const originalText = button.textContent;
        button.textContent = "Generating...";
        button.disabled = true;

        const prompt = `Rewrite the following project description to be more professional, detailed, and engaging.
        Project Title: ${projectTitle}
        Current Description: ${currentDescription}
        New Description:`;

        const newDescription = await callGeminiApi(prompt);
        
        projectDescriptionElement.textContent = newDescription;

        button.textContent = originalText;
        button.disabled = false;
    });
});

// Gemini API integration for generating bio
const generateBioBtn = document.getElementById('generate-bio-btn');
const bioTextElement = document.getElementById('bio-text');
const bioPrompt = `Write a professional bio for a final-year B.Tech student and aspiring Frontend Developer named Gagan Sharma. Mention that he is also actively learning Data Structures and Algorithms (DSA) and building various frontend projects to enhance his skills. The tone should be confident and forward-looking. The user is also proficient in the following languages and technologies: JavaScript (ES6+), HTML5, CSS3, C++, ReactJS, Tailwind CSS, Bootstrap, Redux, React Router, Git, GitHub, VS Code, Netlify, Vercel, Figma, Chrome DevTools.`;

generateBioBtn.addEventListener('click', async () => {
    const originalText = generateBioBtn.textContent;
    generateBioBtn.textContent = "Generating...";
    generateBioBtn.disabled = true;

    const newBio = await callGeminiApi(bioPrompt);
    bioTextElement.textContent = newBio;

    generateBioBtn.textContent = originalText;
    generateBioBtn.disabled = false;
});

// Gemini API integration for generating skill summary
const generateSkillSummaryBtn = document.getElementById('generate-skill-summary-btn');
const skillSummaryElement = document.getElementById('skill-summary');
const skillPrompt = `Generate a concise, single-paragraph summary of the technical skills of a frontend developer. The skills include: Languages: JavaScript (ES6+), HTML5, CSS3, C++; Frameworks/Libraries: ReactJS, Tailwind CSS, Bootstrap, Redux, React Router; Tools: Git, GitHub, VS Code, Netlify, Vercel, Figma, Chrome DevTools; Concepts: REST APIs, Responsive Design, Component Lifecycle, Hooks, State Management. The summary should highlight a strong foundation in frontend development and a passion for modern web technologies.`;

generateSkillSummaryBtn.addEventListener('click', async () => {
    const originalText = generateSkillSummaryBtn.textContent;
    generateSkillSummaryBtn.textContent = "Generating...";
    generateSkillSummaryBtn.disabled = true;

    const newSummary = await callGeminiApi(skillPrompt);
    skillSummaryElement.textContent = newSummary;

    generateSkillSummaryBtn.textContent = originalText;
    generateSkillSummaryBtn.disabled = false;
});

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Check for user's preference in local storage
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
