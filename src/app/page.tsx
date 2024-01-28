"use client";

import { useState, useEffect } from "react";
import { blogPosts } from "@/data/blogPosts";
import { queryEmbeddings } from "@/actions/query";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function Home() {
  const [matches, setMatches] = useState<{ id: string }[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setMatches([]);
      return;
    }
    queryEmbeddings(debouncedQuery).then((matches) => {
      setMatches(matches);
    });
  }, [debouncedQuery]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-[600px]">
        <h1>Searching the Webb.</h1>
        <p>Semantic searching through Matt Webbs blog, interconnected.</p>

        <input
          type="text"
          className="border mt-4 w-full p-1"
          onChange={(e) => setQuery(e.target.value)}
        />

        {matches.length > 0 && (
          <div className="border mt-[-1px]">
            {matches.map((match, idx) => {
              const id = parseInt(match.id.substring(3, match.id.length));
              const blogPost = blogPosts[id];
              return (
                <div className="flex flex-col" key={idx}>
                  <a
                    href={
                      blogPost?.link
                        ? `https://interconnected.org/${blogPost?.link}`
                        : "#"
                    }
                    className="hover:bg-gray-100 p-1"
                  >
                    {blogPost?.title || "No title..."}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
