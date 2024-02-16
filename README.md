# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).
In essence, a URL Shortener is a service that takes a regular URL and transforms it into an encoded version, which redirects back to the original URL. For example:

https://www.lighthouselabs.ca → http://goo.gl/6alQXu

docs
## Final Product
!["Screenshot of URLs page"](https://github.com/rlakhno/tinyapp/blob/master/docs/urls_page.png)(#)
!["Screenshot of register page"](https://github.com/rlakhno/tinyapp/blob/master/docs/register_page.png)(#)
!["https://github.com/rlakhno/tinyapp/tree/master"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- We use the specific technologies to illustrate these concepts:
    Web Server: Node.js
    Middleware: Express
    Template Engine: EJS
- Run the development web server using the `node express_server.js` command.
- Visit http://localhost:8080/ in your browser and make sure you can be redirected to login page.
- Click on Register to register a new user.
- Select Creat New to shorten long URLs.
- Run npm test to test the functions and rout features
