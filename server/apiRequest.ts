import { Request, Response, NextFunction, Router } from 'express';
import OpenAI from 'openai';
const router: Router = Router()

router.post('/question', async (req: Request, res: Response, next: NextFunction) => {
  const sentence = req.body?.sentence as string | undefined
  const result = await execOpenAiRequest(sentence);
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.send({ result: result ?? 'リクエスト失敗'})
})

async function execOpenAiRequest(content: string | undefined): Promise<string | null | undefined> {
  if(!content) return undefined;

  const openai: OpenAI = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const completion: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
    messages: [{ role: "system", content: content }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0]?.message.content;
}

export const apiRequest: Router = router;
