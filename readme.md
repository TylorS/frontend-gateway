# @typed/frontend-gateway (WIP)

> Composable Frontends (AKA microfrontends) @ Scale

> Come back soon for more :smile:

Frontend gateway is your bullet-proof solution for managing feature-driven applications. 
Our gateway can help tame your existing monolith incrementally and keeps your team from being stuck
with legacy code. Heavily inspired by the [Kong API Gateway](https://konghq.com/) - but for the frontend.

## Features

- Routing to applications by hostname, pathname, or through relationships.
- RESTful Application Management API w/ versioning
- Authentication, Logging, and more via plugins
- HTTP/2 Optimized
- Docker Distribution
- Designed with and for TypeScript
  
## Applications & Libraries

### Gateway Service

The gateway service powers the RESTful API and maintains connections with the various clients.
Using HTTP/2, specifically server push, the clients are able to maintain always up-to-date configurations.

### Client Library

The `@typed/gateway` node module is available for retrieving configurations from your gateway service
and orchestrating what your users see on the screen. Works both server-side with Node and in the browser.

### Dashboard UI

A simple UI application for managing all of your configurations.
 