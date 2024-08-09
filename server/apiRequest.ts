import { Request, Response, NextFunction, Router } from 'express';
import OpenAI from 'openai';
const router: Router = Router()

router.post('/question', async (req: Request, res: Response, next: NextFunction) => {
  const sentence = req.body?.sentence as string | undefined
  const result = await execOpenAiRequest(sentence);
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.send({ result: result ?? 'リクエスト失敗'})
})

async function execOpenAiRequest(sentence: string | undefined): Promise<string | null | undefined> {
  if(!sentence) return undefined;
  if(!process.env.OPEN_AI_KEY) return undefined;

  const formattedPrompt = buildRequestPrompt(sentence);

  const openai: OpenAI = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const completion: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'あなたは何でも知っている先生です' },
      { role: 'user', content: formattedPrompt }
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0]?.message.content;
}

function buildRequestPrompt(sentence: string): string {
  return `今から質問をするので、できるだけ具体的に、専門用語を使わず簡潔に、かつ200文字前後で答えてください。${sentence}`;
}

export const apiRequest: Router = router;
