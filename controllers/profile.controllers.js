import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import { ProfileService } from '../services';
import { successResponse } from '../utils';

/**
 * @route   GET /api/v1/profile/complete
 * @desc    Get complete profile with completeness score
 * @access  Private
 */
export const getCompleteProfile = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.getCompleteProfile();

	// return successResponse(res, HttpStatus.OK, 'Profile retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get complete profile endpoint - Coming soon', {});
});

/**
 * @route   PUT /api/v1/profile
 * @desc    Update profile basic info
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.updateProfile();

	// return successResponse(res, HttpStatus.OK, 'Profile updated successfully', data);
	return successResponse(res, HttpStatus.OK, 'Update profile endpoint - Coming soon', {});
});

// ==================== EXPERIENCE CONTROLLERS ====================

/**
 * @route   POST /api/v1/profile/experience
 * @desc    Create new experience
 * @access  Private
 */
export const createExperience = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.createExperience();

	// return successResponse(res, HttpStatus.CREATED, 'Experience added successfully', data);
	return successResponse(res, HttpStatus.OK, 'Create experience endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/profile/experience
 * @desc    Get all experiences
 * @access  Private
 */
export const getExperiences = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.getExperiences();

	// return successResponse(res, HttpStatus.OK, 'Experiences retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get experiences endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/profile/experience/:id
 * @desc    Get single experience
 * @access  Private
 */
export const getExperience = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.getExperience();

	// return successResponse(res, HttpStatus.OK, 'Experience retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get experience endpoint - Coming soon', {});
});

/**
 * @route   PUT /api/v1/profile/experience/:id
 * @desc    Update experience
 * @access  Private
 */
export const updateExperience = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.updateExperience();

	// return successResponse(res, HttpStatus.OK, 'Experience updated successfully', data);
	return successResponse(res, HttpStatus.OK, 'Update experience endpoint - Coming soon', {});
});

/**
 * @route   DELETE /api/v1/profile/experience/:id
 * @desc    Delete experience
 * @access  Private
 */
export const deleteExperience = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// await profileService.deleteExperience();

	// return successResponse(res, HttpStatus.OK, 'Experience deleted successfully', null);
	return successResponse(res, HttpStatus.OK, 'Delete experience endpoint - Coming soon', {});
});

// ==================== EDUCATION CONTROLLERS ====================

/**
 * @route   POST /api/v1/profile/education
 * @desc    Create new education
 * @access  Private
 */
export const createEducation = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.createEducation();

	// return successResponse(res, HttpStatus.CREATED, 'Education added successfully', data);
	return successResponse(res, HttpStatus.OK, 'Create education endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/profile/education
 * @desc    Get all educations
 * @access  Private
 */
export const getEducations = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.getEducations();

	// return successResponse(res, HttpStatus.OK, 'Educations retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get educations endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/profile/education/:id
 * @desc    Get single education
 * @access  Private
 */
export const getEducation = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.getEducation();

	// return successResponse(res, HttpStatus.OK, 'Education retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get education endpoint - Coming soon', {});
});

/**
 * @route   PUT /api/v1/profile/education/:id
 * @desc    Update education
 * @access  Private
 */
export const updateEducation = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// const data = await profileService.updateEducation();

	// return successResponse(res, HttpStatus.OK, 'Education updated successfully', data);
	return successResponse(res, HttpStatus.OK, 'Update education endpoint - Coming soon', {});
});

/**
 * @route   DELETE /api/v1/profile/education/:id
 * @desc    Delete education
 * @access  Private
 */
export const deleteEducation = asyncHandler(async (req, res) => {
	// const profileService = new ProfileService(req);
	// await profileService.deleteEducation();

	// return successResponse(res, HttpStatus.OK, 'Education deleted successfully', null);
	return successResponse(res, HttpStatus.OK, 'Delete education endpoint - Coming soon', {});
});

