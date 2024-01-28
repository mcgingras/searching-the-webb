import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

export const queryEmbeddings = async (q: string) => {
  console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const pc = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  });

  const index = pc.index("test-1");
  const ns1 = index.namespace("ns1");

  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: q,
    encoding_format: "float",
  });

  const vector = embedding.data[0].embedding;

  const queryRequest = {
    vector,
    topK: 5,
    includeValues: true,
  };

  const queryResponse = await ns1.query(queryRequest);
  return queryResponse.matches;
};
