import { NextResponse } from "next/server";
import { leetcodeProfile } from "../../../data/site";

export const revalidate = 600;

const query = `
  query UserStats($username: String!) {
    matchedUser(username: $username) {
      username
      profile { ranking }
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
    }
    allQuestionsCount { difficulty count }
  }
`;

type Difficulty = "All" | "Easy" | "Medium" | "Hard";
type GraphQLResponse = {
  data?: {
    matchedUser?: {
      username: string;
      profile?: { ranking?: number | null } | null;
      submitStats?: { acSubmissionNum: { difficulty: Difficulty; count: number }[] } | null;
    } | null;
    allQuestionsCount?: { difficulty: Difficulty; count: number }[];
  };
  errors?: { message: string }[];
};

function byDifficulty(items: { difficulty: Difficulty; count: number }[] | undefined, difficulty: Difficulty) {
  return items?.find((item) => item.difficulty === difficulty)?.count ?? null;
}

export async function GET() {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "paswanraju-portfolio/1.0" },
      body: JSON.stringify({ query, variables: { username: leetcodeProfile.username } }),
      next: { revalidate },
    });

    if (!response.ok) throw new Error(`LeetCode responded with ${response.status}`);
    const payload = await response.json() as GraphQLResponse;
    if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));

    const user = payload.data?.matchedUser;
    if (!user) throw new Error("LeetCode profile was not found");
    const solved = user.submitStats?.acSubmissionNum;
    const totals = payload.data?.allQuestionsCount;

    const easySolved = byDifficulty(solved, "Easy");
    const easyTotal = byDifficulty(totals, "Easy");
    const mediumSolved = byDifficulty(solved, "Medium");
    const mediumTotal = byDifficulty(totals, "Medium");
    const hardSolved = byDifficulty(solved, "Hard");
    const hardTotal = byDifficulty(totals, "Hard");

    return NextResponse.json({
      username: user.username,
      ranking: user.profile?.ranking ?? null,
      totalSolved: byDifficulty(solved, "All"),
      easy: { solved: easySolved, total: easyTotal },
      medium: { solved: mediumSolved, total: mediumTotal },
      hard: { solved: hardSolved, total: hardTotal },
      profileUrl: leetcodeProfile.profileUrl,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to load LeetCode stats", error);
    return NextResponse.json({ error: "Stats temporarily unavailable" }, { status: 503 });
  }
}
