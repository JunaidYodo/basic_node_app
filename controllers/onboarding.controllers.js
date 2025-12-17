import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import { OnboardingService } from '../services';
import { successResponse } from '../utils';

/**
 * @route   GET /api/v1/onboarding/status
 * @desc    Get onboarding status
 * @access  Private
 */
export const getStatus = asyncHandler(async (req, res) => {
	// const onboardingService = new OnboardingService(req);
	// const data = await onboardingService.getOnboardingStatus();

	// return successResponse(res, HttpStatus.OK, 'Onboarding status retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Onboarding status endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/onboarding/step1
 * @desc    Step 1: Set preferences (roles, location, work mode)
 * @access  Private
 */
export const step1SetPreferences = asyncHandler(async (req, res) => {
	// const onboardingService = new OnboardingService(req);
	// const data = await onboardingService.setPreferences();

	// return successResponse(res, HttpStatus.OK, data.message, data);
	return successResponse(res, HttpStatus.OK, 'Set preferences endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/onboarding/step2
 * @desc    Step 2: Mark resume uploaded (called after resume upload)
 * @access  Private
 */
export const step2MarkResumeUploaded = asyncHandler(async (req, res) => {
	// const onboardingService = new OnboardingService(req);
	// const { resumeId } = req.body;
	// const data = await onboardingService.markResumeUploaded(resumeId);

	// return successResponse(res, HttpStatus.OK, data.message, data);
	return successResponse(res, HttpStatus.OK, 'Mark resume uploaded endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/onboarding/step3
 * @desc    Step 3: Review and confirm profile
 * @access  Private
 */
export const step3ConfirmProfile = asyncHandler(async (req, res) => {
	// const onboardingService = new OnboardingService(req);
	// const data = await onboardingService.confirmProfile();

	// return successResponse(res, HttpStatus.OK, data.message, data);
	return successResponse(res, HttpStatus.OK, 'Confirm profile endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/onboarding/skip
 * @desc    Skip onboarding (can complete later)
 * @access  Private
 */
export const skipOnboarding = asyncHandler(async (req, res) => {
	// const onboardingService = new OnboardingService(req);
	// const data = await onboardingService.skipOnboarding();

	// return successResponse(res, HttpStatus.OK, data.message, data);
	return successResponse(res, HttpStatus.OK, 'Skip onboarding endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/onboarding/restart
 * @desc    Restart onboarding process
 * @access  Private
 */
export const restartOnboarding = asyncHandler(async (req, res) => {
	// const onboardingService = new OnboardingService(req);
	// const data = await onboardingService.restartOnboarding();

	// return successResponse(res, HttpStatus.OK, data.message, data);
	return successResponse(res, HttpStatus.OK, 'Restart onboarding endpoint - Coming soon', {});
});

