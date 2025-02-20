import request from "superagent";
import natural from "natural";
import aposToLexForm from "apos-to-lex-form";
import SW from "stopword";
const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer();

class API {
  async getTopNews() {
    try {
      const query = "https://what-up-china-server.herokuapp.com/top-news/";
      const result = await request.get(query);
      return { data: JSON.parse(result.text) };
    } catch (error) {
      return { error };
    }
  }

  async getTrendingOnBilibili() {
    try {
      const query =
        "https://what-up-china-server.herokuapp.com/bilibili/trending/";
      const result = await request.get(query);
      return { data: JSON.parse(result.text) };
    } catch (error) {
      return { error };
    }
  }

  async getBaiduHotNews() {
    try {
      const query =
        "https://what-up-china-server.herokuapp.com/baidu/hot-news/";
      const result = await request.get(query);
      return { data: JSON.parse(result.text) };
    } catch (error) {
      return { error };
    }
  }

  getTextSentiment(text, lang) {
    const standardisedText = aposToLexForm(text)
      .toLowerCase()
      .replace(/[^a-zA-Z\s]+/g, "");
    const tokenizedReview = tokenizer.tokenize(standardisedText);
    const filteredReview = SW.removeStopwords(tokenizedReview);
    const { SentimentAnalyzer, PorterStemmer } = natural;
    // NB: the original language is in Chinese and is later translated by the user into other languages
    const language = lang || "English";
    const analyzer = new SentimentAnalyzer(language, PorterStemmer, "afinn");

    return analyzer.getSentiment(filteredReview);
  }
}

export default API;
