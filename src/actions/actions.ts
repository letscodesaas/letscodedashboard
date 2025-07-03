'use server';

import fs from 'fs';
import path from 'path';
import { Subscriber } from '@/models/Subscribers.Model';
import { DB } from '@/utils/db';

export const EmailsUploaderActions = async (formData) => {
  const uploadDir = path.join(process.cwd(), 'upload');

  try {
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get the file from FormData
    const file = formData.get('emailfile');

    if (!file || !(file instanceof File)) {
      throw new Error('No file uploaded or invalid file');
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create file path
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file to upload folder
    fs.writeFileSync(filePath, buffer);

    // Process the file based on its type
    const fileExtension = path.extname(file.name).toLowerCase();

    if (fileExtension === '.csv') {
      // Process CSV file
      const csvData = fs.readFileSync(filePath, 'utf8');

      // Parse CSV data properly - assuming emails are separated by commas or newlines
      const emails = csvData
        .trim()
        .split(/[,\n\r]+/)
        .map((email) => email.trim())
        .filter((email) => email && email.includes('@'));
      try {
        // Connect to database
        await DB();

        // Create subscriber documents
        await Promise.allSettled(
          emails.map(async (email) => {
            try {
              const findEmail = await Subscriber.findOne({
                email: email.trim(),
              });
              if (!findEmail) {
                const subscriber = new Subscriber({
                  email: email,
                  subscribed: true,
                });

                await subscriber.save();
              }

              return { email, status: 'success' };
            } catch (err) {
              console.log(`Failed to save ${email}:`, err.message);
              return { email, status: 'failed', error: err.message };
            }
          })
        );

        return {
          success: true,
          message: `CSV file processed successfully.  subscribers added.`,
          fileName: file.name,
          fileSize: file.size,
          emailsProcessed: emails.length,
        };
      } catch (dbError) {
        console.error('Database error:', dbError);

        if (dbError.code === 11000) {
          return {
            success: true,
            message: 'CSV processed with some duplicate emails skipped',
            fileName: file.name,
            fileSize: file.size,
            emailsProcessed: emails.length,
            warning:
              'Some emails were already in the database and were skipped',
          };
        }

        throw dbError;
      }
    } else {
      throw new Error('Only CSV files are supported');
    }
  } catch (error) {
    console.error('Error processing file:', error);

    return {
      success: false,
      message: 'Error processing file: ' + error.message,
      error: error.message,
    };
  } finally {
    // Clean up: delete the upload folder and its contents
    try {
      if (fs.existsSync(uploadDir)) {
        fs.rmSync(uploadDir, { recursive: true, force: true });
        console.log('Upload folder deleted successfully');
      }
    } catch (cleanupError) {
      console.error('Error cleaning up upload folder:', cleanupError);
    }
  }
};
