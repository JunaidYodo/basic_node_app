import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_MODEL } from '../config.js';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

/**
 * Generate AI resume based on user profile and job description
 * @param {Object} userProfile - User profile data
 * @param {Object} jobDescription - Job details
 * @returns {Object} - Generated resume and metadata
 */
export const generateResume = async (userProfile, jobDescription) => {
	try {
		const prompt = `You are an expert resume writer. Create a tailored, ATS-optimized resume based on the following:

USER PROFILE:
Name: ${userProfile.name}
Headline: ${userProfile.headline || 'Professional'}
Summary: ${userProfile.summary || 'Experienced professional'}
Skills: ${JSON.stringify(userProfile.skills || [])}
Experience: ${JSON.stringify(userProfile.experiences || [])}
Education: ${JSON.stringify(userProfile.educations || [])}

JOB DESCRIPTION:
Company: ${jobDescription.company}
Title: ${jobDescription.title}
Description: ${jobDescription.description}
Requirements: ${JSON.stringify(jobDescription.requirements || [])}

INSTRUCTIONS:
1. Highlight relevant experience and skills that match the job requirements
2. Use action verbs and quantifiable achievements
3. Optimize keywords for ATS systems
4. Keep it concise and professional
5. Format in JSON with sections: summary, experience, skills, education

Return ONLY valid JSON in this exact format:
{
  "summary": "Professional summary text",
  "experience": [{"company": "", "title": "", "dates": "", "achievements": []}],
  "skills": ["skill1", "skill2"],
  "education": [{"institution": "", "degree": "", "year": ""}]
}`;

		const response = await openai.chat.completions.create({
			model: OPENAI_MODEL,
			messages: [
				{
					role: 'system',
					content: 'You are an expert resume writer specializing in ATS-optimized resumes. Always respond with valid JSON only.',
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			temperature: 0.7,
			max_tokens: 2000,
		});

		const content = response.choices[0].message.content;
		const tokensUsed = response.usage.total_tokens;

		// Parse JSON response
		let resumeData;
		try {
			resumeData = JSON.parse(content);
		} catch (parseError) {
			// Try to extract JSON from markdown code blocks
			const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
			if (jsonMatch) {
				resumeData = JSON.parse(jsonMatch[1]);
			} else {
				throw new Error('Failed to parse AI response as JSON');
			}
		}

		return {
			resumeData,
			tokensUsed,
			model: OPENAI_MODEL,
			prompt,
			rawResponse: content,
		};
	} catch (error) {
		console.error('OpenAI resume generation error:', error);
		throw new Error('Failed to generate resume: ' + error.message);
	}
};

/**
 * Generate AI cover letter
 * @param {Object} userProfile - User profile data
 * @param {Object} jobDescription - Job details
 * @returns {Object} - Generated cover letter and metadata
 */
export const generateCoverLetter = async (userProfile, jobDescription) => {
	try {
		const prompt = `You are an expert career coach. Write a compelling, personalized cover letter based on:

USER PROFILE:
Name: ${userProfile.name}
Background: ${userProfile.summary || 'Experienced professional'}
Skills: ${JSON.stringify(userProfile.skills || [])}
Experience: ${JSON.stringify(userProfile.experiences?.slice(0, 2) || [])}

JOB DETAILS:
Company: ${jobDescription.company}
Title: ${jobDescription.title}
Description: ${jobDescription.description}

INSTRUCTIONS:
1. Address the hiring manager professionally
2. Show enthusiasm for the company and role
3. Highlight 2-3 key achievements relevant to the job
4. Explain why you're a perfect fit
5. Keep it under 400 words
6. Use a professional but warm tone

Return the cover letter as plain text (no JSON, no markdown).`;

		const response = await openai.chat.completions.create({
			model: OPENAI_MODEL,
			messages: [
				{
					role: 'system',
					content: 'You are an expert cover letter writer. Write compelling, personalized cover letters that get interviews.',
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			temperature: 0.8,
			max_tokens: 1000,
		});

		const coverLetter = response.choices[0].message.content.trim();
		const tokensUsed = response.usage.total_tokens;

		return {
			coverLetter,
			tokensUsed,
			model: OPENAI_MODEL,
			prompt,
		};
	} catch (error) {
		console.error('OpenAI cover letter generation error:', error);
		throw new Error('Failed to generate cover letter: ' + error.message);
	}
};

/**
 * Parse resume from text using AI
 * @param {string} resumeText - Raw resume text
 * @returns {Object} - Parsed resume data
 */
export const parseResume = async (resumeText) => {
	try {
		const prompt = `Extract structured information from this resume. Return ONLY valid JSON:

RESUME TEXT:
${resumeText}

Return this exact JSON structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "summary": "professional summary",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, State",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "description": "Job description"
    }
  ],
  "education": [
    {
      "institution": "School Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM"
    }
  ]
}`;

		const response = await openai.chat.completions.create({
			model: OPENAI_MODEL,
			messages: [
				{
					role: 'system',
					content: 'You are a resume parser. Extract structured data from resumes and return valid JSON only.',
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			temperature: 0.3,
			max_tokens: 2000,
		});

		const content = response.choices[0].message.content;
		const tokensUsed = response.usage.total_tokens;

		// Parse JSON response
		let parsedData;
		try {
			parsedData = JSON.parse(content);
		} catch (parseError) {
			const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
			if (jsonMatch) {
				parsedData = JSON.parse(jsonMatch[1]);
			} else {
				throw new Error('Failed to parse AI response as JSON');
			}
		}

		return {
			parsedData,
			tokensUsed,
			model: OPENAI_MODEL,
		};
	} catch (error) {
		console.error('OpenAI resume parsing error:', error);
		throw new Error('Failed to parse resume: ' + error.message);
	}
};

/**
 * Calculate AI match score between resume and job
 * @param {Object} resume - Resume data
 * @param {Object} job - Job description
 * @returns {Object} - Match score and analysis
 */
export const calculateMatchScore = async (resume, job) => {
	try {
		const prompt = `Analyze how well this resume matches the job requirements. Return a score from 0-100 and brief analysis.

RESUME:
Skills: ${JSON.stringify(resume.skills || [])}
Experience: ${JSON.stringify(resume.experience || [])}

JOB REQUIREMENTS:
${job.description}
${JSON.stringify(job.requirements || [])}

Return ONLY this JSON format:
{
  "score": 85,
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

		const response = await openai.chat.completions.create({
			model: OPENAI_MODEL,
			messages: [
				{
					role: 'system',
					content: 'You are an ATS expert. Analyze resume-job matches and provide scores.',
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			temperature: 0.5,
			max_tokens: 500,
		});

		const content = response.choices[0].message.content;
		const analysis = JSON.parse(content.match(/\{[\s\S]*\}/)[0]);

		return {
			...analysis,
			tokensUsed: response.usage.total_tokens,
		};
	} catch (error) {
		console.error('OpenAI match score error:', error);
		return { score: 0, strengths: [], gaps: [], recommendations: [], error: error.message };
	}
};
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '../config.js';

/**
 * Encrypt sensitive data using AES-256
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted text
 */
export const encrypt = (text) => {
	if (!text) return null;
	try {
		return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
	} catch (error) {
		console.error('Encryption error:', error);
		throw new Error('Failed to encrypt data');
	}
};

/**
 * Decrypt encrypted data
 * @param {string} encryptedText - Encrypted text
 * @returns {string} - Decrypted plain text
 */
export const decrypt = (encryptedText) => {
	if (!encryptedText) return null;
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
		return bytes.toString(CryptoJS.enc.Utf8);
	} catch (error) {
		console.error('Decryption error:', error);
		throw new Error('Failed to decrypt data');
	}
};

/**
 * Hash data using SHA256 (one-way)
 * @param {string} text - Text to hash
 * @returns {string} - Hashed text
 */
export const hash = (text) => {
	return CryptoJS.SHA256(text).toString();
};

/**
 * Generate a random encryption key (for setup)
 * @returns {string} - Random 32-character key
 */
export const generateKey = () => {
	return CryptoJS.lib.WordArray.random(32).toString();
};

