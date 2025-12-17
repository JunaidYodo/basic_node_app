import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import { JobService } from '../services';
import { successResponse } from '../utils';

/**
 * @route   POST /api/v1/job/import
 * @desc    Import job from URL
 * @access  Private
 */
export const importJob = asyncHandler(async (req, res) => {
	// const jobService = new JobService(req);
	// const data = await jobService.importJobFromUrl();

	// return successResponse(res, HttpStatus.OK, 'Job imported successfully', data);
	return successResponse(res, HttpStatus.OK, 'Import job endpoint - Coming soon', {});
});

/**
 * @route   POST /api/v1/job/manual
 * @desc    Create manual job entry
 * @access  Private
 */
export const createManualJob = asyncHandler(async (req, res) => {
	// const jobService = new JobService(req);
	// const data = await jobService.createManualJob();

	// return successResponse(res, HttpStatus.OK, 'Job created successfully', data);
	return successResponse(res, HttpStatus.OK, 'Create manual job endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/job/list
 * @desc    Get user's jobs
 * @access  Private
 */
export const getJobs = asyncHandler(async (req, res) => {
	// const jobService = new JobService(req);
	// const data = await jobService.getUserJobs();

	// return successResponse(res, HttpStatus.OK, 'Jobs retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get jobs endpoint - Coming soon', {});
});

/**
 * @route   GET /api/v1/job/:id
 * @desc    Get job by ID
 * @access  Private
 */
export const getJobById = asyncHandler(async (req, res) => {
	// const jobService = new JobService(req);
	// const data = await jobService.getJobById();

	// return successResponse(res, HttpStatus.OK, 'Job retrieved successfully', data);
	return successResponse(res, HttpStatus.OK, 'Get job by ID endpoint - Coming soon', {});
});

/**
 * @route   PUT /api/v1/job/:id
 * @desc    Update job
 * @access  Private
 */
export const updateJob = asyncHandler(async (req, res) => {
	// const jobService = new JobService(req);
	// const data = await jobService.updateJob();

	// return successResponse(res, HttpStatus.OK, 'Job updated successfully', data);
	return successResponse(res, HttpStatus.OK, 'Update job endpoint - Coming soon', {});
});

/**
 * @route   DELETE /api/v1/job/:id
 * @desc    Delete job
 * @access  Private
 */
export const deleteJob = asyncHandler(async (req, res) => {
	// const jobService = new JobService(req);
	// await jobService.deleteJob();

	// return successResponse(res, HttpStatus.OK, 'Job deleted successfully', null);
	return successResponse(res, HttpStatus.OK, 'Delete job endpoint - Coming soon', {});
});

