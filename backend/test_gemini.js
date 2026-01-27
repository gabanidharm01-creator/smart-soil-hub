 import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-bison-001' });
    console.log('Calling generateContent...');
    const result = await model.generateContent('Hello from test script');
    console.log('Result keys:', Object.keys(result || {}));
    console.log('Result:', result);
  } catch (err) {
    console.error('=== GEMINI TEST ERROR ===');
    console.error('Error constructor:', err?.constructor?.name);
    console.error(err);
    console.error(err?.stack);
    try {
      console.error('Error props:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    } catch (e) {
      console.error('Error while stringifying error:', e);
    }
  }
})();