---
title: "Mushroom Cultivation Supplier"
url: "https://zugz.byronwade.com"
category: "Client Work"
date: 2023-09-01
excerpt: "Zugzology is a Next.js storefront for a mushroom-supplies shop. Shopify holds the catalog. Search results use a plain score. This repository has no field-management system."
status: "Archived"
featured: false
---

# Zugzology

Zugzology is the storefront for a mushroom-supplies shop. Products, collections, the cart, and custom pages come from Shopify. This repository is that storefront.

The code is in the [Zugzology repository](https://github.com/byronwade/zugzology.com). Everything below was checked against [main at `5b7f80d8`](https://github.com/byronwade/zugzology.com/tree/5b7f80d81b4819f9d38f51da89bf3247763077ed), committed on July 31, 2026. That commit is still the head of `main`. The README on that commit says Next.js 15. The [package manifest](https://github.com/byronwade/zugzology.com/blob/5b7f80d81b4819f9d38f51da89bf3247763077ed/package.json) depends on Next.js 16, React 19, NextAuth 4, and Tailwind CSS 3.

Visit [zugz.byronwade.com](https://zugz.byronwade.com). I did not sign in there, and I did not measure traffic or sales.

## Catalog, search, and cart

The product list asks Shopify's Storefront API (version 2024-01) for a page of products. The default sort is Shopify's best-selling order. Price, title, and date are the other sorts. If the live shop cannot be reached, or the storefront token is missing, the same helper serves Shopify's public Mock.shop demo catalog instead of an empty page. A separate panel can tell the visitor the store is unreachable and still offer links home, to products, and to help.

Search loads matches and then re-orders them in the browser. The score uses stock, a bonus for prices in the middle of the set, how recently the product was published, and a featured rank stored on the Shopify metafield `custom.featured_rank`. A featured rank of 1 adds more points than the other factors combined, so a featured product can sit above a well-stocked one. The match itself is a case-insensitive check of the title, description, and tags. The main catalog does not run this score.

The wishlist keeps product handles in the browser's local storage. Opening the wishlist page loads those products in one request. It is not a Shopify wishlist.

Product pages put nine more product groups under the main product, each in its own loading boundary: related products, best sellers, sale items, latest, the same category, the same collection, featured collections, similar tags, and a random set.

## Pages, writing, and feeds

A Shopify page can carry a list of section metaobjects. The storefront renders five kinds: hero, content, product carousel, call to action, and feature grid. Any other type shows a dashed box that says the section is not implemented yet.

Blog posts are Shopify articles. The blogs index titles itself "Expert Mushroom Cultivation Blog". Those posts are store content. They are not written in this repository, and this page does not grade them.

Two routes publish the catalog for ads. `/api/feeds/google-merchant` returns Google Merchant XML. `/api/feeds/facebook` returns a Facebook catalog CSV. Both are built from the product list and are sent with `Cache-Control: no-store`.

Home, a product, a collection, and a blog post each have an Open Graph image route.

## Accounts

The sign-in button is "Sign in with Shopify". It starts NextAuth's Shopify provider, which sends the visitor to Shopify's customer-account authorize URL, and only when the shop id, client id, and client secret are all set. Without those three, the provider refuses to sign anyone in.

A separate register form creates a customer through the Storefront `customerCreate` mutation and then a classic customer access token. That is a second account path in the same app. I did not try either path on the live shop.

Account pages in the app include profile details and order history. Those screens read Shopify. They are not a grower profile.

## How fresh the prices are

The shared Storefront helper caches a response for five minutes unless the caller passes a different window. The product-list function passes `cache: "no-store"`, and a comment there says that is for fresh data, but the helper never reads that argument. A settings file also lists a 24-hour product window and a 12-hour collection window. The product list does not pass those windows either.

So a price or a stock count on a list is the value Shopify returned on the cached response, not a live socket.

A Web Vitals route accepts a POST and keeps the last 1,000 samples in the server process's memory. The file says a production store should use a database. Typed shopping events call Vercel Analytics, and that file says custom events need a paid Vercel plan. Whether the live shop records them was not checked.

## What I removed, and what was never here

In October 2025 this repository deleted recommendation, forecasting, sentiment, and segmentation routes that called OpenAI, Anthropic, or Groq. Product order since then is Shopify's sort, plus the search score above. Docs in the repository still describe the deleted system. Those docs are stale.

An earlier version of this page mapped products to field equipment, accounts to grower profiles, and orders to harvest records, then listed sensors and yield forecasts as later phases. None of that is in this commit. The public code is a shop. I'll describe field tools here if they are actually built.
