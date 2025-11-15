import request from "superagent";
import natural from "natural";
import aposToLexForm from "apos-to-lex-form";
import SW from "stopword";
const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer();

const API_ROOT =
  process.env.REACT_APP_API_ROOT || "http://localhost:3000";

async function getJson(path) {
  try {
    const result = await request.get(`${API_ROOT}${path}`);
    return { data: JSON.parse(result.text) };
  } catch (error) {
    return { error };
  }
}

class API {
  getTopNews() {
    return getJson("/top-news/");
  }

  getTrendingOnBilibili() {
    return getJson("/bilibili/trending/");
  }

  getBaiduHotNews() {
    return getJson("/baidu/hot-news/");
  }

  getBaiduHotSearch() {
    return getJson("/baidu/hot-search/");
  }

  getToutiaoHotBoard() {
    return getJson("/toutiao/hot-board/");
  }

  getDoubanHotMovies() {
    return getJson("/douban/hot-movies/");
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
