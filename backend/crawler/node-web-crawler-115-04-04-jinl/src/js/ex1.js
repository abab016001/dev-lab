import axios from "axios";
import * as cheerio from "cheerio";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

const url = "https://tw.news.yahoo.com/";

export const main = async () => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const csv_data = [];

  // 取得 標題、網址
  $("a[href*='https://tw.sports.yahoo.com/news/']").each((i, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");

    csv_data.push({ 索引: i, 標題: title, 網址: link })
  });

  // 取得 內文
  for (const index in csv_data) {
    const row = csv_data[index];
    const { data } = await axios.get(row.網址);
    const $ = cheerio.load(data);

    const p_ary = [];
    $(".atoms p").each((i, el) => {
      const content = $(el)
        .contents()
        .filter((i, node) => node.type === 'text')
        .text().trim();
      p_ary.push(content);
    });

    row.內文 = p_ary.join("");
  }

  const csvWriter = createCsvWriter({
    path: "src/asset/output.csv",
    header: [
      { "id": "索引", title: "索引" },
      { "id": "標題", title: "標題" },
      { "id": "網址", title: "網址" },
      { "id": "內文", title: "內文" }, // 增加『內文』欄位
    ]
  });

  csvWriter.writeRecords(csv_data).then(() => console.log("CSV 已產生"));
};