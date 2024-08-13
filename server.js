const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { BLOGS } = require('./blogs');

const app = express();

app.use(express.static('public'))

BLOGS.forEach(blog => {
    app.use(`/${blog}`, createProxyMiddleware({
        target: `https://www.blog.withallo.com/${blog}/`,
        changeOrigin: true,
        pathRewrite: {
          '^/blog': '', // Remove '/blog' prefix from the forwarded request
        },
      }));
})
  
  // Proxy requests to /blog/* to https://www.blog.withallo.com/*
app.use('/blog', createProxyMiddleware({
  target: 'https://www.blog.withallo.com',
  changeOrigin: true,
  pathRewrite: {
    '^/blog': '', // Remove '/blog' prefix from the forwarded request
  },
}));

// Proxy all other requests to Framer
app.use('/', createProxyMiddleware({
  target: 'https://interactive-booking-964831.framer.app',
  changeOrigin: true,
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
