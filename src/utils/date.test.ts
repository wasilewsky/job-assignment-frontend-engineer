import { formatArticleDate } from "./date";

describe("formatArticleDate", () => {
  it("returns the original string when the value is not a valid date", () => {
    expect(formatArticleDate("not-a-date")).toBe("not-a-date");
  });

  it("formats a valid ISO date in en-US long form", () => {
    expect(formatArticleDate("2020-06-01")).toMatch(/June/);
    expect(formatArticleDate("2020-06-01")).toContain("2020");
  });
});
