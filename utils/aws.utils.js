import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } from '../config.js';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
	},
});

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} folder - S3 folder path
 * @returns {Object} - Upload result with key and URL
 */
export const uploadToS3 = async (fileBuffer, fileName, mimeType, folder = 'resumes') => {
	try {
		const fileExtension = fileName.split('.').pop();
		const uniqueFileName = `${folder}/${uuidv4()}.${fileExtension}`;

		const upload = new Upload({
			client: s3Client,
			params: {
				Bucket: AWS_S3_BUCKET,
				Key: uniqueFileName,
				Body: fileBuffer,
				ContentType: mimeType,
				ACL: 'private',
			},
		});

		const result = await upload.done();

		return {
			key: uniqueFileName,
			location: result.Location,
			bucket: AWS_S3_BUCKET,
		};
	} catch (error) {
		console.error('S3 upload error:', error);
		throw new Error('Failed to upload file to S3');
	}
};

/**
 * Get signed URL for private S3 object
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration in seconds (default: 1 hour)
 * @returns {string} - Signed URL
 */
export const getS3SignedUrl = async (key, expiresIn = 3600) => {
	try {
		const command = new GetObjectCommand({
			Bucket: AWS_S3_BUCKET,
			Key: key,
		});

		const url = await getSignedUrl(s3Client, command, { expiresIn });
		return url;
	} catch (error) {
		console.error('S3 signed URL error:', error);
		throw new Error('Failed to generate signed URL');
	}
};

/**
 * Delete file from S3
 * @param {string} key - S3 object key
 * @returns {boolean} - Success status
 */
export const deleteFromS3 = async (key) => {
	try {
		const command = new DeleteObjectCommand({
			Bucket: AWS_S3_BUCKET,
			Key: key,
		});

		await s3Client.send(command);
		return true;
	} catch (error) {
		console.error('S3 delete error:', error);
		throw new Error('Failed to delete file from S3');
	}
};

/**
 * Get file from S3
 * @param {string} key - S3 object key
 * @returns {Buffer} - File buffer
 */
export const getFromS3 = async (key) => {
	try {
		const command = new GetObjectCommand({
			Bucket: AWS_S3_BUCKET,
			Key: key,
		});

		const response = await s3Client.send(command);
		const chunks = [];

		for await (const chunk of response.Body) {
			chunks.push(chunk);
		}

		return Buffer.concat(chunks);
	} catch (error) {
		console.error('S3 get error:', error);
		throw new Error('Failed to retrieve file from S3');
	}
};

