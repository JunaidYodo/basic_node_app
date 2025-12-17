import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

import mammoth from 'mammoth';
import { parseResume } from './openai.utils.js';

/**
 * Extract text from PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {string} - Extracted text
 */
export const extractTextFromPDF = async (buffer) => {
	try {
		const data = await pdf(buffer);
		return data.text;
	} catch (error) {
		console.error('PDF parsing error:', error);
		throw new Error('Failed to parse PDF file');
	}
};

/**
 * Extract text from DOCX buffer
 * @param {Buffer} buffer - DOCX file buffer
 * @returns {string} - Extracted text
 */
export const extractTextFromDOCX = async (buffer) => {
	try {
		const result = await mammoth.extractRawText({ buffer });
		return result.value;
	} catch (error) {
		console.error('DOCX parsing error:', error);
		throw new Error('Failed to parse DOCX file');
	}
};

/**
 * Parse resume file and extract structured data
 * @param {Buffer} fileBuffer - Resume file buffer
 * @param {string} mimeType - File MIME type
 * @returns {Object} - Parsed resume data
 */
export const parseResumeFile = async (fileBuffer, mimeType) => {
	try {
		let resumeText = '';

		// Extract text based on file type
		if (mimeType === 'application/pdf') {
			resumeText = await extractTextFromPDF(fileBuffer);
		} else if (
			mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
			mimeType === 'application/msword'
		) {
			resumeText = await extractTextFromDOCX(fileBuffer);
		} else {
			throw new Error('Unsupported file format. Please upload PDF or DOCX file.');
		}

		// Use AI to parse the extracted text
		const parsedData = await parseResume(resumeText);

		return {
			rawText: resumeText,
			...parsedData,
		};
	} catch (error) {
		console.error('Resume file parsing error:', error);
		throw new Error('Failed to parse resume file: ' + error.message);
	}
};

/**
 * Validate resume data completeness
 * @param {Object} resumeData - Parsed resume data
 * @returns {Object} - Validation result with completeness score
 */
export const validateResumeCompleteness = (resumeData) => {
	const checks = {
		hasName: !!resumeData.name,
		hasEmail: !!resumeData.email,
		hasPhone: !!resumeData.phone,
		hasSummary: !!resumeData.summary,
		hasSkills: Array.isArray(resumeData.skills) && resumeData.skills.length > 0,
		hasExperience: Array.isArray(resumeData.experience) && resumeData.experience.length > 0,
		hasEducation: Array.isArray(resumeData.education) && resumeData.education.length > 0,
	};

	const completedChecks = Object.values(checks).filter(Boolean).length;
	const totalChecks = Object.keys(checks).length;
	const completeness = Math.round((completedChecks / totalChecks) * 100);

	const missing = [];
	if (!checks.hasName) missing.push('Name');
	if (!checks.hasEmail) missing.push('Email');
	if (!checks.hasPhone) missing.push('Phone');
	if (!checks.hasSummary) missing.push('Professional Summary');
	if (!checks.hasSkills) missing.push('Skills');
	if (!checks.hasExperience) missing.push('Work Experience');
	if (!checks.hasEducation) missing.push('Education');

	return {
		completeness,
		isComplete: completeness === 100,
		checks,
		missing,
	};
};

