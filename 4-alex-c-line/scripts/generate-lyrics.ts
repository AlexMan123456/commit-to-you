import { execa } from "execa";
import path from "node:path";

export interface LyricConfig {
  verse: Record<"first" | "second", string[]>;
  chorus: string[];
  bridge: string[];
}

async function generateLyrics(
  lines: string[],
  sectionName: "verse-1" | "verse-2" | "chorus" | "bridge",
) {
  for (const [index, line] of lines.entries()) {
    const imagePath = path.join(
      "4-alex-c-line",
      "dist",
      "images",
      sectionName,
      `${sectionName}-line-${index}`,
    );
    if (line === "--") {
      await execa`alex-c-line artwork --save-png ${imagePath}`;
    } else {
      await execa`alex-c-line artwork --subtitle-text ${line} --subtitle-color white --save-png ${imagePath}`;
    }
  }
}

(async () => {
  const lyrics: LyricConfig = {
    verse: {
      first: [
        "here to help you at your command!",
        "You can install me right in!",
        "Here in your system or here in your project space!",
        "--", // Use default tagline
        "I can take care of the tasks of monotony",
        "Run those three scripts all at once",
        "I hope that you feel a boost in efficiency",
        "I'll do tasks while you have fun!",
        "My name is...",
      ],
      second: [
        "I'll bring you templates to help you mark down a plan!",
        "Document all of your work!",
        "I'll help you calculate what the next version\nfrom here will be!",
        "Make them aware what will work!",
        "I can help you to prepare before you commit!",
        "What checks I run is your choice!",
        "When you are ready to show the world\nwhat you've done",
        "We'll tag and run a deploy!",
        "When you're ready, call me...",
      ],
    },
    chorus: [
      "", // An empty subtitle, so we can display just alex-c-line itself
      "brings info right to your console!",
      "Runs tasks for you in the background!",
      "I'll be at hand, when you say...",
      "run command!",
      "so call me..."
    ],
    bridge: [
      "Bring the files, I'll write you out a plan!",
      "Change the version, your app will be out in time!",
      "If you need my help, just run the command,",
      "Here in your terminal, install...",
    ],
  };

  await generateLyrics(lyrics.verse.first, "verse-1");
  await generateLyrics(lyrics.verse.second, "verse-2");
  await generateLyrics(lyrics.chorus, "chorus");
  await generateLyrics(lyrics.bridge, "bridge");
})();
