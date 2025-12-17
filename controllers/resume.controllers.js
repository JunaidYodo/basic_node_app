import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import { ResumeService } from '../services';
import { successResponse } from '../utils';

/**
 * @route   POST /api/v1/resume/upload
 * @desc    Upload and parse resume
 * @access  Private
 */
export const uploadResume = asyncHandler(async (req, res) => {
	// const resumeService = new ResumeService(req);
	// const data = await resumeService.uploadResume();

	// return successResponse(res, HttpStatus.OK, 'Resume uploaded and parsed successfully', data);
	return successResponse(res, HttpStatus.OK, 'Upload resume endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/resume/list
 * @desc    Get user's resumes
 * @access  Private
 */
export const getResumes = asyncHandler(async (req, res) => {
	// const resumeService = new ResumeService(req);
	// const data = await resumeService.getUserResumes();

	// return successResponse(res, HttpStatus.OK, 'Resumes retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get resumes endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/resume/:id
 * @desc    Get resume by ID
 * @access  Private
 */
export const getResumeById = asyncHandler(async (req, res) => {
	// const resumeService = new ResumeService(req);
	// const data = await resumeService.getResumeById();

	// return successResponse(res, HttpStatus.OK, 'Resume retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get resume by ID endpoint - Coming soon', {});
});

/**
 * @route   DELETE /api/v1/resume/:id
 * @desc    Delete resume
 * @access  Private
 */
export const deleteResume = asyncHandler(async (req, res) => {
	// const resumeService = new ResumeService(req);
	// await resumeService.deleteResume();

	// return successResponse(res, HttpStatus.OK, 'Resume deleted successfully', null);
	return successResponse(res, HttpStatus.OK, 'Delete resume endpoint - Coming soon', {});
});

/**
 * @route   PUT /api/v1/resume/:id/set-master
 * @desc    Set resume as master
 * @access  Private
 */
export const setMasterResume = asyncHandler(async (req, res) => {
	// const resumeService = new ResumeService(req);
	// const data = await resumeService.setMasterResume();

	// return successResponse(res, HttpStatus.OK, 'Master resume set successfully', data);
	return successResponse(res, HttpStatus.OK, 'Set master resume endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/resume/profile/me
 * @desc    Get user profile (via resume service)
 * @access  Private
 */
export const getResumeProfile = asyncHandler(async (req, res) => {
	// const resumeService = new ResumeService(req);
	// const data = await resumeService.getUserProfile();

	// return successResponse(res, HttpStatus.OK, 'Profile retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get resume profile endpoint - Coming soon', {});
});

/**
 * @route   PUT /api/v1/resume/profile/me
 * @desc    Update user profile (via resume service)
 * @access  Private
 */
export const updateResumeProfile = asyncHandler(async (req, res) => {
	// const resumeService = new ResumeService(req);
	// const data = await resumeService.updateUserProfile();

	// return successResponse(res, HttpStatus.OK, 'Profile updated successfully', data);
	return successResponse(res, HttpStatus.OK, 'Update resume profile endpoint - Coming soon', {});
});

