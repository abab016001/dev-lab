import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  console.log(`有人訪問了：${context.url.pathname}`);

  if (context.url.pathname.startsWith('/admin')) {
    const pass = context.url.searchParams.get('pass');
    if (pass != "123") {
      // 如果沒有登入，就跳轉回首頁
      return context.redirect('/');
    }
  }

  // 繼續執行後續的請求
  const response = await next();
  return response;
});