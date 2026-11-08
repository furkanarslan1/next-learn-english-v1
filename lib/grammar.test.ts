import { describe, expect, it } from "vitest";
import { parseGrammarContent } from "./grammar";

describe("parseGrammarContent", () => {
  it("reads a complete content object", () => {
    const content = parseGrammarContent({
      summary: "Özet",
      rules: [{ title: "Kural", text: "Metin" }],
      forms: [{ label: "Olumlu", formula: "a + b", examples: [{ en: "I go.", tr: "Giderim." }] }],
      signals: ["always"],
      notes: ["Not"],
      exercises: [{ sentence: "I ___ go.", options: ["do", "does"], answer: 0, explanation: "I ile do." }],
    });
    expect(content.summary).toBe("Özet");
    expect(content.rules).toHaveLength(1);
    expect(content.forms[0].examples[0].tr).toBe("Giderim.");
    expect(content.exercises[0].answer).toBe(0);
  });

  it("falls back to empty values for missing or broken content", () => {
    for (const bad of [null, "text", 5, [], {}, { rules: "not a list", exercises: 3 }]) {
      const content = parseGrammarContent(bad as never);
      expect(content.summary).toBe("");
      expect(content.rules).toEqual([]);
      expect(content.exercises).toEqual([]);
    }
  });
});
