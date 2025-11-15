import { expect } from "chai";
import API from "../src/helpers/API";

describe("API helper tests", () => {
  before(() => {
    this.api = new API();
  });

  it("can get the top news in China", async () => {
    const { data: latestNews } = await this.api.getTopNews();
    expect(latestNews.length).to.not.equal(
      0,
      "should return at least one article",
    );
  });
});
