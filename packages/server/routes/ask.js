import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
console.log(process.env.OPENAI_API_KEY, 9)
router.post('/', async (req, res) => {
    console.log('ask', 11)
    const prompt = req.body.prompt;
    console.log(prompt, 13)

    if (prompt == null) {
        throw new Error('Uh oh, no prompt was provided');
    }

    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 64,
    });

    const completion = response.data.choices[0].text;

    return res.status(200).json({
        success: true,
        message: completion,
    });
});

// router.get('/', (req, res, next) => {
//     console.log('ask');
//     console.log(req.headers);
//     console.log(next);
//     res.json({message: 'Hello ask'});
// });

export default router;
